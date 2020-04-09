
const _ = require("lodash");

const FCG = require("fantasy-content-generator");

const _help = require("./help.js");

module.exports = {
	name: "fantasy-content-generator",
	aliases: ["fcg","generate"],
	description: "Uses the functions of Fantasy Content Generator by Tom Gray.",
	args: true,
	usage: "fcg <name || npc>",
	execute(msg, args) {
		//Code here
		const action = args.shift();
		console.log("FCG command: "+action);
		switch (action) {
			case "name":
				GenerateRandomName(msg.channel, args);
				break;
			case "npc":
				GenerateRandomNpc(chn, args);
				break;
			default:
				return;
		}
	}
}

function GenerateRandomName(chn, args) {
	var n = FCG.Names.generate();
	var n = n.formattedData;
	n.lastName = _.toUpper(n.lastName);
	var msgData = n.firstName + " " + n.lastName + " (" + n.race + " " + n.gender + ")";;
	chn.send(msgData);
}

function GenerateRandomNpc(chn, args) {
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