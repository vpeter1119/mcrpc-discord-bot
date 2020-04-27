// The beverage module listening to a command
let alcoholLimit = 100; // in pure alcohol unit (container size * alcohol percentage)
let timeToWait = 600; // in seconds

module.exports = {
  name: "beverage",
  aliases: ["drink", "bev", "adjinni"],
  description:
    "Boris brings you a beverage - either of your choice or what he deems appropraite.",
  args: true,
  usage:
    "drink menu (to see the menu)\n|drink random (for a random beverage)\n|drink order <amount type !drink> (for a specific beverage, drink name is must have but you can omit amount or type)\nExample #1: |drink order pohár bor\nExample #2: |drink random\nExample #3: |drink order korsó vörös sör",
  execute(msg, args) {
    let bev = new Beverage(); // an empty object with the schema of Beverage
    let action = args[0]; // separating action
    if (!global.locals[msg.author.username]) {
      // setting up local user if it does not exist yet
      global.locals[msg.author.username] = {
        alcohol: 0,
        drunk: false,
        lastDrink: null,
        history: []
      };
    }

    let user = global.locals[msg.author.username];

    switch (action) {
      case "add":
        bev.AddDrink(msg, args[1], args[2], args[3]);
        break;
      case "modify":
        bev.ModifyDrink(msg, args[1], args[2], args[3]);
        break;
      case "remove":
        bev.RemoveDrink(msg, args[1], args[2], args[3]);
        break;
      case "menu":
        ShowMenu(msg, IsDrunk(user));
        break;
      case "random":
        if (IsDrunk(user)) {
          StopDrinking(msg, user);
        } else {
          RandomDrink(msg, user);
        }
        break;
      case "order":
        if (IsDrunk(user)) {
          StopDrinking(msg, user);
        } else {
          OrderDrink(msg, user, args);
        }
        break;
      default:
        ErrorMessage(
          msg,
          "Nem lehet, hogy be vagy rúgva és már nem tudsz értelmesen beszélni?",
          null
        );
        return;
    }
  }
};

// Setting up mongoose and mongoose-related functionalities - on the beverageSchema
const mongoose = require("mongoose");

let options = {
  //Insert any schema options here
};
let beverageSchema = mongoose.Schema(
  {
    name: { type: String },
    types: { type: Array },
    containers: { type: Array }
  },
  options
);

beverageSchema.methods.AddDrink = function(msg, name, containers, types) {
  Beverage.find({ name: name }, async function(err, bevs) {
    if (global.debug) {
      console.log(name, containers, types);
      console.log(bevs);
    }

    let already = bevs.find(b => {
      return b.name == name;
    });
    if (already) {
      msg.channel.send(
        "Ilyen ital már létezik, módosítsd azt, vagy töröld először."
      );
      return;
    }

    let contArray = containers.split(",").map(i => {
      return { name: i.split("|")[0], size: i.split("|")[1] };
    });
    let typeArray = types.split(",").map(i => {
      return { name: i.split("|")[0], perc: i.split("|")[1] };
    });

    var entry = new Beverage();
    entry.name = name;
    entry.containers = contArray;
    entry.types = typeArray;

    const res = await entry.save(function(err, item) {
      if (err) {
        console.log(err);
        return;
      } else {
        msg.channel.send("Sikeresen hozzáadtad: " + name);
        if (global.debug) {
          console.log("Drink added:");
          console.log(item);
        }
      }
    });
  });
};

beverageSchema.methods.ModifyDrink = function(msg, name, containers, types) {
  Beverage.find({ name: name }, async function(err, bevs) {
    if (err) {
      ErrorMessage(
        msg,
        "Nem találom az italt, amit módosítani szeretnél...",
        err
      );
      return;
    }
    let bev = bevs[0];

    let finalContainers = bev.containers;
    let containerModifications = containers.split(",");
    for (var i = 0; i < containerModifications.length; i++) {
      let details = containerModifications[i].split("|");
      let action = details[0];
      let contName = details.length > 1 ? details[1] : null;
      let contSize = details.length > 2 ? details[2] : null;

      if (action == "-") {
        finalContainers = finalContainers.filter(function(cont) {
          return cont.name !== contName;
        });
      } else {
        if (!contName || !contSize) {
          ErrorMessage(
            msg,
            "Oszt ezt mibe kéne öntenem? Vagy csak nem mondtad meg, hogy mekkora amibe lehet tölteni?",
            "Nincs container név vagy container size"
          );
          return true;
        }

        finalContainers.push({
          name: contName,
          size: contSize
        });
      }
    }

    let finalTypes = bev.types;
    let typeModifications = types.split(",");
    for (var i = 0; i < typeModifications.length; i++) {
      let details = typeModifications[i].split("|");
      let action = details[0];
      let typeName = details.length > 1 ? details[1] : null;
      let typeAlc = details.length > 2 ? details[2] : null;

      if (action == "-") {
        finalTypes = finalTypes.filter(function(t) {
          return t.name !== typeName;
        });
      } else {
        if (!typeName || !typeAlc) {
          ErrorMessage(
            chn,
            "Oszt ez milyen típusú pia? Meg mennyire erős?",
            "Nincs type név vagy type alcohol percentage"
          );
          return true;
        }

        finalTypes.push({
          name: typeName,
          perc: typeAlc
        });
      }
    }

    bev.types = finalTypes;
    bev.containers = finalContainers;

    const res = await Beverage.updateOne({ _id: bev._id }, bev, (err, res) => {
      if (err) {
        ErrorMessage(msg, "Valamit nem sikerült módosítanom a pián...", err);
        return;
      } else {
        msg.channel.send("Sikeresen módosítottad!");
      }
    });
  });
};

beverageSchema.methods.RemoveDrink = function(msg, name) {
  Beverage.find({ name: name }, async function(err, bevs) {
    if (err || bevs.length == 0) {
      ErrorMessage(
        msg,
        "Biztos vagy benne, hogy van ilyen ital? : " + name,
        err
      );
      return;
    }
    let bev = bevs[0];
    const removal = await Beverage.deleteOne({ _id: bev._id }, (err, resp) => {
      if (err) {
        ErrorMessage(msg, "Nem sikerült törölnöm... Túlságosan szeretem", err);
        return;
      } else {
        msg.channel.send("Sikeresen töröltük a választékból!");
        if (global.debug) {
          console.log("Drink removed.");
          console.log(resp);
        }
      }
    });
  });
};

let Beverage = mongoose.model("Beverage", beverageSchema);

// Non-mongoose related functionalities
OrderDrink = (msg, user, args) => {
  Beverage.find({}, async function(err, bevs) {
    console.log(args);
    let drink;
    let drinkContainer;
    let drinkType;

    if (args.length == 2) {
      // name only - random the container and type
      var already = bevs.find(b => {
        return b.name == args[1];
      });
      if (!already) {
        ErrorMessage(
          msg,
          "Hát öcsém olyan italunk nincs is. Nézd meg jobban a választékot!",
          "invalid name argument"
        );
        return;
      } else {
        drink = already;
        drinkContainer =
          already.containers[RandomBetween(0, already.containers.length - 1)];
        drinkType = already.types[RandomBetween(0, already.types.length - 1)];
      }
    } else if (args.length == 3) {
      // name and either container or type - random the other
      var already = bevs.find(b => {
        return b.name == args[2];
      });
      if (!already) {
        ErrorMessage(
          msg,
          "Hát öcsém olyan italunk nincs is. Nézd meg jobban a választékot!",
          "invalid name argument or name not last"
        );
        return;
      } else {
        drink = already;
        var isArgContainer = already.containers.find(c => {
          return c.name == args[1];
        });
        console.log(isArgContainer);
        drinkContainer = isArgContainer
          ? isArgContainer
          : already.containers[RandomBetween(0, already.containers.length - 1)];
        var isArgType = already.types.find(t => {
          return t.name == args[1];
        });
        drinkType = isArgType
          ? isArgType
          : already.types[RandomBetween(0, already.types.length - 1)];
      }
    } else {
      var already = bevs.find(b => {
        return b.name == args[3];
      });
      if (!already) {
        ErrorMessage(
          msg,
          "Hát öcsém olyan italunk nincs is. Nézd meg jobban a választékot!",
          "invalid name argument"
        );
        return;
      } else {
        drink = already;
        var isArgContainer = already.containers.find(c => {
          return c.name == args[1];
        });
        if (!isArgContainer) {
          ErrorMessage(
            msg,
            "Oszt ez milyen kübli? Ilyenem nincs amit kérsz, mibe töltsem?",
            "invalid container argument"
          );
          return;
        }
        drinkContainer = isArgContainer;
        var isArgType = already.types.find(t => {
          return t.name == args[2];
        });
        if (!isArgType) {
          ErrorMessage(
            msg,
            "Oszt ez milyen fajta? Ilyenem nincs amit kérsz, válassz másikat!",
            "invalid type argument"
          );
          return;
        }
        drinkType = isArgType;
      }
    }

    if (!drink || !drinkType || !drinkContainer) {
      ErrorMessage(msg, "Nem hallottam öcsi, mit kértél?", "arguments invalid");
      return;
    }

    const texts = [
      "Na, tessék, itt van egy ",
      "Nesze, egészségedre, egy ",
      "Fogadjunk nem ittál még ilyen jót ebből: "
    ];
    msg.channel.send(
      texts[RandomBetween(0, texts.length - 1)] +
        drinkContainer.name +
        " " +
        drinkType.name +
        " " +
        drink.name
    );

    DrinkHappens(msg, user, drink, drinkContainer, drinkType);
  });
};

ShowMenu = (msg, isDrunk) => {
  Beverage.find(function(err, beverages) {
    if (err) return console.log(err);
    if (global.debug) console.log(beverages);

    let toEmbed = {};
    toEmbed.title = "Jelenlegi menü";
    toEmbed.fields = [];

    for (var i = 0; i < beverages.length; i++) {
      let entry = {};
      entry.name = beverages[i].name + " (";

      for (var j = 0; j < beverages[i].containers.length; j++) {
        entry.name +=
          beverages[i].containers[j].name +
          " - " +
          beverages[i].containers[j].size +
          "ml";
        if (j != beverages[i].containers.length - 1) entry.name += ", ";
      }
      entry.name += ")";

      entry.value = "";
      for (var j = 0; j < beverages[i].types.length; j++) {
        entry.value +=
          beverages[i].types[j].name + " (" + beverages[i].types[j].perc + "%)";
        if (j != beverages[i].types.length - 1) entry.value += ", ";
      }

      toEmbed.fields.push(entry);
    }

    msg.channel.send("", {
      embed: toEmbed
    });
    if (isDrunk)
      msg.channel.send(
        "Viszont öcsi, hiába nézed, kiszolgálni úgysem fogok ilyen részeg disznókat!"
      );
  });
};

RandomDrink = (msg, user) => {
  Beverage.find(function(err, beverages) {
    if (err) return console.log(err);
    if (global.debug) console.log(beverages);

    let txt = "";

    let chosenDrink;
    let chosenType;
    let chosenContainer;
    let chance = 12 - user.history.length; // the more the user drank the more likely Borisz recognizes them. For the first 2 drinks (hence 10+2 = 12) it will default give random and not favourite
    if (RandomBetween(1, 10) % 10 >= chance) {
      // favourite drink from history
      var fav = user.history.length > 0 ? mode(user.history) : null;
      if (fav) {
        var favDrink = fav.split("|")[0];
        var favContainer = fav.split("|")[1];
        var favType = fav.split("|")[2];
        chosenDrink = beverages.find(b => {
          return b.name == favDrink;
        });
        chosenType = chosenDrink.types.find(t => {
          return t.name == favType;
        });
        chosenContainer = chosenDrink.containers.find(c => {
          return c.name == favContainer;
        });

        txt +=
          "Tudom ám, hogy mit szoktál mostanában inni, úgyhogy a kedvencedet adom: ";
      }
    }

    // if not giving favourite by random or there is no history yet, then randomize a drink
    if (!chosenDrink) {
      chosenDrink = beverages[RandomBetween(0, beverages.length - 1)];
      chosenType =
        chosenDrink.types[RandomBetween(0, chosenDrink.types.length - 1)];
      chosenContainer =
        chosenDrink.containers[
          RandomBetween(0, chosenDrink.containers.length - 1)
        ];

      txt +=
        "Hát fiam, téged se láttalak még ebben a kocsmában, úgyhogy idd meg ezt, aztán meglátjuk. ";
    }

    txt +=
      "Tessék, itt van egy " +
      chosenContainer.name +
      " " +
      chosenType.name +
      " " +
      chosenDrink.name;
    msg.channel.send(txt);

    DrinkHappens(msg, user, chosenDrink, chosenContainer, chosenType);
  });
};

// Helper function - to be called when a user drinks something (updates user info)
DrinkHappens = (msg, user, drink, container, type) => {
  let chanceToKick = RandomBetween(1, 20);
  if (global.debug) console.log(chanceToKick);
  if (chanceToKick == 20) {
    msg.channel.send(
      "Hűha, ez igen. Ilyen gyorsan nem láttam még senkit felhúzni ezt az italt! Meg se kottyant, mi?"
    );
  } else if (chanceToKick == 1) {
    msg.channel.send(
      "Fiam, ide látom, hogy ez egyből a fejedbe szállt, óvatosan!"
    );
  }

  UpdateLocalUser(msg, user, drink, container, type, chanceToKick);
};

UpdateLocalUser = (msg, user, drink, container, type, chanceToKick) => {
  // updating last drink timestamp
  user.lastDrink = msg.createdTimestamp;
  // updating alcohol percentage
  let addition = parseFloat(container.size) * parseFloat(type.perc) * 0.01;
  if (chanceToKick == 20) addition = addition / 2;
  else if (chanceToKick == 1) addition = addition * 2;
  if (global.debug)
    console.log("Current state " + user.alcohol + ". Addition: " + addition);
  user.alcohol = (parseFloat(user.alcohol) + addition).toFixed(2);

  if (user.alcohol > alcoholLimit * 2) {
    msg.channel.send("Asszem it baj lesz, koma...");
  }
  // updating history
  var entry = drink.name + "|" + container.name + "|" + type.name;
  user.history.push(entry);
  if (user.history.length > 10)
    user.history = user.history.slice(Math.max(user.history.length - 10, 0)); // limit to 10 last drinks
  if (global.debug) {
    console.log(user);
    console.log(user.history);
  }
};

StopDrinking = (msg, user) => {
  let timeElapsed = Math.floor((msg.createdTimestamp - user.lastDrink) / 1000);
  let remainingTime = timeToWait - timeElapsed;
  let txt = "";
  let timeToWaitInMins = timeToWait / 60;

  if (remainingTime <= 0) {
    user.alcohol = user.alcohol * 0.5;
    if (IsDrunk(user)) {
      // still drunk? let's wait another 15 minutes
      user.lastDrink = msg.createdTimestamp;
      txt =
        "Még mindig nem tűnsz valami józannak, sok volt az az első adag! Ha még " +
        timeToWaitInMins +
        " percet kibírsz hányás nélkül, akkor talán kapsz egy pohár sört.";
    } else {
      txt =
        "Aggódtam, hogy kicsit sokat ittál, de egész jól nézel ki. Mit is kérsz?";
    }
  } else {
    txt =
      "Ha így folytatod, semmi nem lesz belőled holnapra. Be vagy rúgva, nem adok már többet! Várj még egy kicsit, úgy " +
      remainingTime +
      " másodpercet. Ha egyáltalán érted, hogy az mennyi, akkor jó úton haladsz!";
  }

  msg.channel.send(txt);
};

// Generic error message if a command goes wrong
function ErrorMessage(msg, text, error) {
  if (global.debug) console.log(error);
  msg.channel.send(text);
}

// Helper function to determine if user is drunk
IsDrunk = user => {
  return user.alcohol >= alcoholLimit;
};

// Helper function : generates a random integer between a minimum and maximum value
function RandomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Helper function : returns the most frequent (mode/modus) item from an array
function mode(array) {
  if (array.length == 0) return null;
  var modeMap = {};
  var maxEl = array[0],
    maxCount = 1;
  for (var i = 0; i < array.length; i++) {
    var el = array[i];
    if (modeMap[el] == null) modeMap[el] = 1;
    else modeMap[el]++;
    if (modeMap[el] > maxCount) {
      maxEl = el;
      maxCount = modeMap[el];
    }
  }
  return maxEl;
}
