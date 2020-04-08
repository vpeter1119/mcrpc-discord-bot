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
    game: {
      name: "Role | %help for info",
      type: "PLAYING:"
    }
  });
  console.log("Logged in as " + client.user.tag + "!");
});

client.on("message", msg => {
  var chn = msg.channel;
  var operator = msg.content.slice(0, 1);
  if (operator === "%") {
    //var cmd = msg.content.slice(1, 9);
    var input = msg.content.slice(1).split(" ", 3);
	var cmdRoot = input[0];
	var cmdSpec = input[1];
	console.log("Debug: "+input[0]+" "+input[1]);
	var cmdCont = msg.content.split("%" + input[0]+" "+input[1] + " ")[1];
	console.log("Command: " + cmdRoot + "_" + cmdSpec + "_" + cmdCont);
    switch (cmdRoot) {
      case "help":
        msg.react("👍");
        _help.Help(chn);
        break;
      case "wa":
        msg.react("👍");
        _wa.Main(cmdSpec, chn, cmdCont);
        break;
      case "fr":
        msg.react("👍");
        _fr.WikiLink(chn, cmdCont);
        break;
      case "rndname":
        _rn.GenerateRandomNames(chn, cmdCont);
        break;
      default:
        _help.UnknownCommand(chn);
    }
  }
});

client.login(token);
