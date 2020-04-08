
const _ = require("lodash");

const FCG = require("fantasy-content-generator");

const _help = require("./help.js");

exports.Main = function(cmd, chn, cont) {
	switch (cmd) {
		case "name":
			GenerateRandomName(chn, cont);
			break;
		case "npc":
			GenerateRandomNpc(chn, cont);
			break;
		default:
			_help.UnknownCommand(chn);
	}
}

function GenerateRandomName(chn, params) {
	var n = FCG.Names.generate();
	var n = n.formattedData;
	n.lastName = _.toUpper(n.lastName);
	var msgData = n.firstName + " " + n.lastName + " (" + n.race + " " + n.gender + ")";;
	chn.send(msgData);
}

function GenerateRandomNpc(chn, params) {
	var npc = FCG.NPCs.generate();
	var seed = npc.seed;
	var npc = npc.formattedData;
	var msgData = {
		embed: {
			title: npc.name,
			description: (""+npc.race+" "+npc.gender)
		}
	}
	chn.send("> *Seed: " + seed + "*");
	chn.send("Here's a random NPC, fresh from the oven:", msgData);
	var quotes = "A few words from **"+npc.name+"**\n" + "> " + npc.traits.join(" ") + "\n" + "> " + npc.desires.join(" ");
	chn.send(quotes);
}