
const _ = require("lodash");

const FCG = require("fantasy-content-generator");
const {sNames} = require ("../data/settlement_names.json"); //This is a list of random fantasy town names from http://www.dungeoneering.net/d100-list-fantasy-town-names/

//Workaround for "fields.flat is not a function" issue
/*
Object.defineProperty(Array.prototype, 'flat', {
    value: function(depth = 1) {
      return this.reduce(function (flat, toFlatten) {
        return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
      }, []);
    }
});
*/

module.exports = {
	name: "fantasy-content-generator",
	aliases: ["fcg","generate","gen"],
	description: "Uses the functions of Fantasy Content Generator by Tom Gray.",
	args: true,
	usage: "fcg <name [-r race][-g gender] || npc [-r race][-g gender][-s seed] || settlement [-t type][-n name]>",
	cooldown: 1,
	execute(msg, args) {
		//Code here
		const set = args.shift();
		console.log("FCG command: "+set);
		switch (set) {
			case "name":
				GenerateRandomName(msg, args);
				break;
			case "npc":
				GenerateRandomNpc(msg, args);
				break;
			case "settlement":
			case "sett":
			case "town":
			case "city":
			case "s":
				GenerateRandomSettlement(msg, args);
				break;
			default:
				return;
		}
	}
}

function GenerateRandomName(msg, args) {
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
	msg.channel.send(msgData);
}

function GenerateRandomNpc(msg, args) {
	//Acceptable parameters: -r (for race), -g (for gender), -s (for seed), -wa (for including a link to create a WorldAnvil article)
	var params = {};
	var waAdd = false;
	if (!args || args===[]) {
		params = {};
	} else {
		if (args.indexOf("-r") > -1) params.race = _.camelCase(args[((args.indexOf("-r"))+1)]);
		if (args.indexOf("-g") > -1) params.gender = args[((args.indexOf("-g"))+1)];
		if (args.indexOf("-s") > -1) params.seed = args[((args.indexOf("-s"))+1)];
		if (args.indexOf("-wa") > -1) waAdd = true;
	}
	var npcData = FCG.NPCs.generate(params);
	var npc = npcData.formattedData;
	var msgData = {
		embed: {
			title: npc.name,
			description: (""+npc.race+" "+npc.gender),
			fields: [
				{
					name: "**Seed**",
					value: `You can recreate this exact NPC with the following command:\n\`${msg} -s ${npcData.seed}\``,
					inline: false
				},
				{
					name: "**Traits**",
					value: npc.traits.join("\n"),
					inline: false
				},
				{
					name: "**Desire**",
					value: npc.desires.join("\n"),
					inline: false
				},
				{
					name: "**Relations**",
					value: npc.relations.length > 0 ? `**${_.capitalize(npc.relations[0].relationTitle)}**: ${npc.relations[0].npc.formattedData.name} (${npc.relations[0].npc.formattedData.race} ${npc.relations[0].npc.formattedData.gender})` : "No relations.",
				}
			]
		}
	}
	if (waAdd) {
		var waUrl = (`https://www.worldanvil.com/world/article/new?title=${npc.name.replace(/ /g, "+")}&type=person`);
		msgData.embed.fields.push({
			name: `Create ${npc.name} on WorldAnvil!`,
			value: waUrl,
			inline: false
		});
	}
	msg.channel.send("",msgData);
	
}

function GenerateRandomSettlement(msg, args) {
	//Acceptable parameters: -t (for type), -n (for name), 
	var params = {};
	var name = false;
	var waAdd = false;
	var n = Math.floor(Math.random() * 10 + 1);
	if (!args || args===[]) {
		params = {};
	} else {
		if (args.indexOf("-t") > -1) params.type = _.snakeCase(args[((args.indexOf("-t"))+1)]);
		if (args.indexOf("-s") > -1) params.seed = args[((args.indexOf("-s"))+1)];
		if (args.indexOf("-n") > -1) {
			name = args[((args.indexOf("-n"))+1)]
		} else {
			name = sNames[n];
		}
		if (args.indexOf("-wa") > -1) waAdd = true;
	}
	var data = FCG.Settlements.generate(params);
	var seed = data.seed;
	var s = {
		name: name,
		type: _.lowerCase(data.type),
		pops: data.population,
		poi: data.establishments.formattedData
	}	
	var msgData = {
		embed: {
			title: s.name,
			description: `A ${s.type} with a population of ${s.pops}.`,
		}
	};
	msg.channel.send("> *Seed: " + seed + "*");
	msg.channel.send("", msgData);
	msg.channel.send(`The most famous place in ${s.name} is the ${s.poi.type} called **${s.poi.name}**.\n> ${s.poi.description}\n> A little-known secret about this place is: ||${s.poi.secret}||`);
	if (waAdd) {
		var waSUrl = (`https://www.worldanvil.com/world/article/new?title=${s.name.replace(/ /g, "+")}&type=settlement`);
		var waPoiUrl = (`https://www.worldanvil.com/world/article/new?title=${s.poi.name.replace(/ /g, "+")}&type=landmark`);
		var waData1 = {
			title: (`Create ${s.name} on WorldAnvil!`),
			url: waSUrl,
			description: ("Click on the above link to create the article.")
		}
		var waData2 = {
			title: (`Create ${s.poi.name} on WorldAnvil!`),
			url: waPoiUrl,
			description: ("Click on the above link to create the article.")
		}
		msg.channel.send("",{embed:waData1});
		msg.channel.send("",{embed:waData2});
	}
}
