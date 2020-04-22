const webModules = require("../web/modules/modules.js");

module.exports = {
  name: "moments",
  aliases: ["moment", "mom"],
  description: "Used store and bring up memorable RPG moments.",
  args: true,
  usage: "moments [add <From> <Text>|random]",
  execute(msg, args, debug) {
    const action = args.shift();
    switch (action) {
      case "add":
        AddMoment(msg, args, debug);
        break;
      case "random":
        BringUpRandomMoment(msg, debug);
        break;
      case "clearfrom":
        ClearMomentsFrom(msg, args, debug);
        break;
      default:
        return;
    }
  }
};

function AddMoment(msg, data, debug) {
  var from = data.shift();
  var text = data.join(" ");
  // Create a new entry in database and handle the result with a callback function
  webModules.moments.Create(from, text, result => {
    if (result && result.ok) {
      msg.reply("I will remember this moment. Probably.");
    } else {
      if (debug) {
        console.log("ERROR!");
        console.log(result.error);
      }
      msg.reply("please excuse me, something went wrong.");
    }
  });
}

function BringUpRandomMoment(msg, debug) {
  // Get all moments from database and handle the result with a callback function
  webModules.moments.GetAll(result => {
    if (result && result.ok) {
      if (!result.object.length)
        return msg.reply("sorry, I don't remember any memorable moments.");

      moments = result.object;
      var i = Math.floor(Math.random() * moments.length);
      var moment = moments[i];
      msg.channel.send("", {
        embed: { title: `${moment.from}:${moment.text}` }
      });
    } else {
      if (debug) {
        console.log("ERROR!");
        console.log(result.error);
      }
      msg.reply("please excuse me, something went wrong.");
    }
  });
}

function ClearMomentsFrom(msg, args, debug) {
  var from = args.shift();
  //Delete moments based on their "from" value
  webModules.moments.Clear({ from: from }, result => {
    if (result && result.ok) {
      msg.channel.send(
        `All moments from ${from} have been deleted. *sad violin*`
      );
    } else {
      if (debug) {
        console.log("ERROR!");
        console.log(result.error);
      }
      msg.reply("please excuse me, something went wrong.");
    }
  });
}
