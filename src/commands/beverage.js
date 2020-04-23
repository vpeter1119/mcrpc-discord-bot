// The beverage module listening to a command
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
    switch (action) {
      case "add":
        bev.AddDrink(debug, args[1], args[2], args[3]);
        break;
      case "modify":
        bev.ModifyDrink(debug, args[1], args[2], args[3]);
        break;
      case "remove":
        bev.RemoveDrink(debug, args[1], args[2], args[3]);
        break;
      case "menu":
        bev.ShowMenu(debug);
        break;
      case "random":
        RandomDrink(msg.channel, amount, drink, debug);
        break;
      case "stop":
        ServeDrink(msg.channel, amount, drink, debug);
        break;
      default:
        ErrorMessage(msg.channel, amount, drink, debug);
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

beverageSchema.methods.ShowMenu = function(debug) {
  Beverage.find(function(err, beverages) {
    if (err) return console.log(err);
    console.log(beverages);
  });
};

beverageSchema.methods.AddDrink = function(debug, name, containers, types) {
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

beverageSchema.methods.RemoveDrink = function(debug, name, containers, types) {
  Beverage.find({ name: name }, async function(err, bevs) {
    if (err || bevs.length == 0) {
      ErrorMessage(
        debug,
        "An error occurred when removing. Are you sure '" +
          name +
          "' is an existing drink?"
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

beverageSchema.methods.ModifyDrink = function(debug, name, containers, types) {
  Beverage.find({ name: name }, async function(err, bevs) {
    if (err) {
      ErrorMessage(debug, "Nem tal�lom az italt, amit m�dos�tani szeretn�l...");
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
            "Oszt ezt mibe k�red? Vagy csak nem mondtad meg, hogy mekkora amibe k�red?"
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
  /*
    if (debug) console.log(name, containers, types);
    let contArray = containers.split(",").map(i => {
        return { name: i.split("|")[0], size: i.split("|")[1] };
    });
    let typeArray = types.split(",");

    this.name = name;
    this.containers = contArray;
    this.types = typeArray;

    this.save(function (err, item) {
        if (err) {
            console.log(err);
            return;
        } else {
            if (debug) {
                console.log("Drink added:");
                console.log(item);
            }
        }
    });*/
};

let Beverage = mongoose.model("Beverage", beverageSchema);
/*
var beer = new Beverage({
  name: "beer",
  types: ["lager", "ale", "stout", "wit", "wheat", "IPA", "APA"],
  amounts: [
    {
      name: "pint",
      size: "568"
    }
  ]
});
console.log(beer);
beer.isEnough();

console.log(beer.amounts);
beer.save(function(err, beer) {
  if (err) {
    console.log(err);
    return;
  } else {
    beer.isEnough();
  }
});*/

function RandomDrink(chn, amount, drink, debug) {
  drink = "beer";
  ServeDrink(chn, amount, drink);
}

function ServeDrink(chn, amount, drink, debug) {
  chn.send("Hello, itt is van " + amount + " " + drink);
}
