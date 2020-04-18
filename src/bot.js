
//Import config
const {
	token,
	prefix,
	defaultCooldown
} = require("./config/config.js");

//Require modules
const fs = require("fs");
const Discord = require("discord.js");

//Require web app
const web = require("./web/index.js");

//Set up discord classes
const client = new Discord.Client();
client.commands = new Discord.Collection();
//exports.bot = client;

require('dotenv').config();

const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter(file => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	console.log("Reading command: "+command.name);
	client.commands.set(command.name, command);
}
const cooldowns = new Discord.Collection();

//Workaround for "fields.flat is not a function" issue
Object.defineProperty(Array.prototype, 'flat', {
    value: function(depth = 1) {
      return this.reduce(function (flat, toFlatten) {
        return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flat(depth-1) : toFlatten);
      }, []);
    }
});

client.on("ready", () => {
  //client.user.setStatus("available");
  client.user.setActivity(`${prefix}help`, {type: 'LISTENING'});
  
});

client.on("message", msg => {
	if (!msg.content.startsWith(prefix) || msg.author.bot) return;
	
	const args = msg.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
	console.log("Command received: " + commandName + " with arguments: " + args);
	
	const command = client.commands.get(commandName)
		|| client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
		
	if (!command) return;
	
	if (command.args && !args.length) {
		let reply = `You didn't provide any arguments, ${msg.author}!`;
		if (command.usage) {
			reply += `\n Correct usage: ${prefix}${command.usage}`
		}
		return msg.channel.send(reply);
	}
	
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
	}
	const now = Date.now();
	const timestamps = cooldowns.get(command.name);
	const cooldownAmount = (command.cooldown || defaultCooldown) * 1000;
	if (timestamps.has(msg.author.id)) {
		const expirationTime = timestamps.get(msg.author.id) + cooldownAmount;
		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return msg.reply(`please wait ${timeLeft.toFixed(1)} more seconds before reusing this command.`);
		}
	}
	timestamps.set(msg.author.id, now);
	setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);
	
	try {
		command.execute(msg, args);
	} catch (err) {
		console.error(err);
		msg.reply("there was an error trying to execute that command!");
	}
});

client.login(token)
.then(() => {
	console.log("Logged in as " + client.user.tag + "!");
	console.log(`Bot listening to prefix '${prefix}'`);
});
