
const _ = require("lodash");

const FCG = require("fantasy-content-generator");
const {sNames} = require ("../data/settlement_names.json"); //This is a list of random fantasy town names from http://www.dungeoneering.net/d100-list-fantasy-town-names/

module.exports = {
	name: "fantasy-content-generator",
	aliases: ["fcg","generate"],
	description: "Uses the functions of Fantasy Content Generator by Tom Gray.",
	args: true,
	usage: "fcg <name || npc>",
	execute(msg, args) {
		//Code here
		const set = args.shift();
		console.log("FCG command: "+set);
		switch (set) {
			case "name":
				GenerateRandomName(msg.channel, args);
				break;
			case "npc":
				GenerateRandomNpc(msg.channel, args);
				break;
			case "settlement":
			case "sett":
			case "town":
			case "city":
			case "s":
				GenerateRandomSettlement(msg.channel, args);
				break;
			default:
				return;
		}
	}
}

function GenerateRandomName(chn, args) {
	//Acceptable parameters: -r (for race), -g (for gender)
	var params = {};
	if (!args || args===[]) {
		params = {};
	} else {
		if (args.indexOf("-r") > -1) params.race = _.camelCase(args[((args.indexOf("-r"))+1)]);
		if (args.indexOf("-g") > -1) params.gender = args[((args.indexOf("-g"))+1)];
	}
	var nData = FCG.Names.generate(params);
	var n = nData.formattedData;
	n.lastName = _.toUpper(n.lastName);
	var msgData = (`${n.firstName} ${n.lastName} (${n.race} ${n.gender})`);
	chn.send(msgData);
}

function GenerateRandomNpc(chn, args) {
	//Acceptable parameters: -r (for race), -g (for gender), -s (for seed)
	var params = {};
	if (!args || args===[]) {
		params = {};
	} else {
		if (args.indexOf("-r") > -1) params.race = _.camelCase(args[((args.indexOf("-r"))+1)]);
		if (args.indexOf("-g") > -1) params.gender = args[((args.indexOf("-g"))+1)];
		if (args.indexOf("-s") > -1) params.seed = args[((args.indexOf("-s"))+1)].replace(/ /g,'');
	}
	console.log("Generating NPC with the following parameters:");
	console.log(params);
	var npcData = FCG.NPCs.generate(params);
	console.log("Name: " + npcData.formattedData.name);
	console.log("Seed: "+npcData.seed);
	var npc = npcData.formattedData;
	var msgData = {
		embed: {
			title: npc.name,
			description: (""+npc.race+" "+npc.gender)
		}
	}
	//chn.send("> *Seed: " + seed + "*");
	chn.send(`> *Seed: ${npcData.seed}*`);
	chn.send("Here's a random NPC, fresh from the oven:", msgData);
	var quotes = "A few words from **"+npc.name+"**\n" + "> " + npc.traits.join(" ") + "\n" + "> " + npc.desires.join(" ");
	chn.send(quotes);
}

function GenerateRandomSettlement(chn, args) {
	//Acceptable parameters: -t (for type), -n (for name), 
	var params = {};
	var name = false;
	var n = Math.floor(Math.random() * 10 + 1);
	if (!args || args===[]) {
		params = {};
	} else {
		if (args.indexOf("-t") > -1) params.type = _.snakeCase(args[((args.indexOf("-t"))+1)]);
		if (args.indexOf("-n") > -1) {
			name = args[((args.indexOf("-n"))+1)]
		} else {
			name = sNames[n];
		}
	}
	var data = FCG.Settlements.generate(params);
	var seed = data.seed;
	var s = {
		name: name,
		type: _.lowerCase(data.type),
		pops: data.population,
		poi: data.establishments.formattedData
	}
	console.log(s);	
	var msgData = {
		embed: {
			title: s.name,
			description: `A ${s.type} with a population of ${s.pops}.`,
		}
	};
	chn.send("> *Seed: " + seed + "*");
	chn.send("", msgData);
	chn.send(`The most famous place in ${s.name} is the ${s.poi.type} called **${s.poi.name}**.\n> ${s.poi.description}\n> A little-known secret about this place is: ||${s.poi.secret}||`);
}