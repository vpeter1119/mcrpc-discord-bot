const Discord = require("discord.js");
const client = new Discord.Client();
exports.bot = client;

require('dotenv').config();
const token = process.env.TOKEN;

const _fr = require("./commands/forgotten-realms.js");
const _help = require("./commands/help.js");
const _rn = require("./commands/random-name.js");
const _wa = require("./commands/worldanvil.js");

client.on("ready", () => {
  client.user.setStatus("available");
  client.user.setPresence({
    status: "online",
    activity: {
      name: "to %help",
      type: "LISTENING:"
    }
  });
  console.log("Logged in as " + client.user.tag + "!");
});

client.on("message", msg => {
  var chn = msg.channel;
  var first = msg.content.slice(0, 1);
  if (first === "%") {
    var cmd = msg.content.slice(1, 9);
    console.log("Command: " + cmd);
    switch (cmd) {
      case "help":
        msg.react("👍");
        _help.Help(chn);
        break;
      case "wa link ":
        msg.react("👍");
        _wa.Link(chn, msg.content.slice(9));
        break;
      case "fr wiki ":
        msg.react("👍");
        _fr.WikiLink(chn, msg.content.slice(9));
        break;
      case "rndname ":
        _rn.GenerateRandomNames(chn, msg.content.slice(9));
        break;
      default:
        _help.UnknownCommand(chn);
    }
  }
});

client.login(token);
