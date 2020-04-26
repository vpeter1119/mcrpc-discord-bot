// The beverage module listening to a command
let locals = {};

module.exports = {
  name: "beverage",
  aliases: ["drink", "bev"],
  description:
    "Boris brings you a beverage - either of your choice or what he deems appropraite.",
  args: true,
  usage: "drink [amount] [random|drink_name]",
  execute(msg, args, debug) {
    let bev = new Beverage();
    console.log(args);
    let action = args[0];

    if (!locals[msg.author.username]) {
      locals[msg.author.username] = {
        lastDrink: msg.createdTimestamp,
        alcohol: 0,
        drunk: false
      };
    }

    let remainingTime = 0;
    if (locals[msg.author.username].alcohol > 5)
      locals[msg.author.username].drunk = true;
    if (locals[msg.author.username].drunk) {
      if (
        msg.createdTimestamp - locals[msg.author.username].lastDrink >
        900000
      ) {
        locals[msg.author.username].alcohol -= 2;
      } else {
        remainingTime =
          900 - (msg.createdTimestamp - locals[msg.author.username].lastDrink);
        action = "stop";
      }
    }

    console.log(msg.createdTimestamp - locals[msg.author.username].lastDrink);

    locals[msg.author.username].lastDrink = msg.createdTimestamp;

    console.log(locals[msg.author.username]);
    switch (action) {
      case "add":
        bev.AddDrink(debug, msg.channel, args[1], args[2], args[3]);
        break;
      case "modify":
        bev.ModifyDrink(debug, msg.channel, args[1], args[2], args[3]);
        break;
      case "remove":
        bev.RemoveDrink(debug, msg.channel, args[1], args[2], args[3]);
        break;
      case "menu":
        bev.ShowMenu(debug, msg.channel);
        break;
      case "order":
        bev.OrderDrink(debug, msg, args);
        break;
      case "random":
        bev.RandomDrink(debug, msg.channel, msg.author);
        break;
      case "stop":
        bev.StopDrinking(debug, msg.channel, msg.author, remainingTime);
        break;
      default:
        ErrorMessage(
          debug,
          msg.channel,
          "Nem lehet, hogy be vagy rúgva és már nem tudsz értelmesen beszélni?",
          null
        );
        return;
    }
  }
};

// Setting up mongoose
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

beverageSchema.methods.OrderDrink = function(debug, msg, args) {
  console.log("hello");
};

beverageSchema.methods.ShowMenu = function(debug, chn) {
  Beverage.find(function(err, beverages) {
    if (err) return console.log(err);
    if (debug) console.log(beverages);

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
        entry.value += beverages[i].types[j];
        if (j != beverages[i].types.length - 1) entry.value += ", ";
      }

      toEmbed.fields.push(entry);
    }

    chn.send("", {
      embed: toEmbed
    });
  });
};

beverageSchema.methods.AddDrink = function(
  debug,
  chn,
  name,
  containers,
  types
) {
  if (debug) console.log(name, containers, types);
  let contArray = containers.split(",").map(i => {
    return { name: i.split("|")[0], size: i.split("|")[1] };
  });
  let typeArray = types.split(",");

  this.name = name;
  this.containers = contArray;
  this.types = typeArray;

  this.save(function(err, item) {
    if (err) {
      console.log(err);
      return;
    } else {
      if (debug) {
        console.log("Drink added:");
        console.log(item);
      }
    }
  });
};

beverageSchema.methods.RemoveDrink = function(
  debug,
  chn,
  name,
  containers,
  types
) {
  Beverage.find({ name: name }, async function(err, bevs) {
    if (err || bevs.length == 0) {
      ErrorMessage(
        debug,
        chn,
        "An error occurred when removing. Are you sure '" +
          name +
          "' is an existing drink?",
        err
      );
      return;
    }
    let bev = bevs[0];
    const removal = await Beverage.deleteOne({ _id: bev._id }, (err, resp) => {
      if (err) {
        console.log(err);
        return;
      } else {
        if (debug) {
          console.log("Drink removed.");
          console.log(resp);
        }
      }
    });
  });
};

beverageSchema.methods.ModifyDrink = function(
  debug,
  chn,
  name,
  containers,
  types
) {
  Beverage.find({ name: name }, async function(err, bevs) {
    if (err) {
      ErrorMessage(
        debug,
        chn,
        "Nem tal�lom az italt, amit m�dos�tani szeretn�l...",
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
            debug,
            chn,
            "Oszt ezt mibe k�red? Vagy csak nem mondtad meg, hogy mekkora amibe k�red?",
            "ninc container név vagy container size"
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
      let type = details.length > 1 ? details[1] : null;
      if (action == "+") finalTypes.push(type);
      else if (action == "-") {
        const index = finalTypes.indexOf(type);
        if (index > -1) {
          finalTypes.splice(index, 1);
        }
      }
    }

    bev.types = finalTypes;
    bev.containers = finalContainers;

    const res = await Beverage.updateOne({ _id: bev._id }, bev);
  });
};

beverageSchema.methods.RandomDrink = function(debug, chn, author) {
  Beverage.find(function(err, beverages) {
    if (err) return console.log(err);
    if (debug) console.log(beverages);

    let chosenDrink = beverages[RandomBetween(0, beverages.length - 1)];
    console.log(chosenDrink);
    let chosenType =
      chosenDrink.types[RandomBetween(0, chosenDrink.types.length - 1)];
    let chosenContainer =
      chosenDrink.containers[
        RandomBetween(0, chosenDrink.containers.length - 1)
      ];

    locals[author.username].alcohol++;
    chn.send(
      "Na komám, itt van neked egy " +
        chosenContainer.name +
        " " +
        chosenType +
        " " +
        chosenDrink.name
    );
  });
};

beverageSchema.methods.StopDrinking = function(
  debug,
  chn,
  author,
  remainingTime
) {
  console.log(locals);
  let txt =
    "Ha így folytatod, semmi nem lesz belőled holnapra. Be vagy rúgva, nem adok már többet! Várj még egy kicsit, úgy " +
    remainingTime +
    " másodpercet. Ha egyáltalán érted, hogy az mennyi, akkor jó úton haladsz!";
  chn.send(txt);
};

let Beverage = mongoose.model("Beverage", beverageSchema);

function ErrorMessage(debug, chn, text, error) {
  if (debug) console.log(error);
  chn.send(text);
}

function ServeDrink(chn, amount, drink, debug) {
  chn.send("Hello, itt is van " + amount + " " + drink);
}

function RandomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
