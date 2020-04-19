//Import config
const {
	token,
	prefix,
    defaultCooldown,
    production
} = require("./config/config.js");

//Require modules
const fs = require("fs");
const Discord = require("discord.js");
require('dotenv').config();

//Set up discord classes
const client = new Discord.Client();
client.commands = new Discord.Collection();
//exports.bot = client;

// Set up variables on first run
const debug = !production; // global debug
const cooldowns = new Discord.Collection(); // set of cooldowns for each command

const commandFiles = fs.readdirSync(`${__dirname}/commands`).filter(file => file.endsWith(".js")); // reading all .js files from commands folder
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
    if (debug) console.log("Reading command: "+command.name);
	client.commands.set(command.name, command);
}

// When the bot loads this is the first it does:
client.login(token).then(() => {
    console.log("Logged in as " + client.user.tag + "!");
    console.log(`Bot listening to prefix '${prefix}'`);
});
client.on("ready", () => {
    client.user.setActivity(`${prefix}help`, {type: 'LISTENING'});
});

// When a message is caught
client.on("message", msg => {
	if (!msg.content.startsWith(prefix) || msg.author.bot) return; // if coming from bot or not starting with required prefix then ignore

    /* Processing input*/

    //  separating arguments, selecting command 
	const args = msg.content.slice(prefix.length).split(/ +/);
	const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (debug) console.log("Command received: " + commandName + " with arguments: " + args);
    if (!command) return;
    
	// Check if there are enough arguments - if needed
	if (command.args && args.length == 0) {
		let reply = `You didn't provide any arguments, ${msg.author}!`;
		if (command.usage) {
			reply += `\n Correct usage: ${prefix}${command.usage}`
		}
		return msg.channel.send(reply);
	}

    /* Cooldown settings */

    // adding cooldown value to previously created collection if it is not added yet (on first usage)
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Discord.Collection());
    }
    // checking if cooldown is in progress or not - if yes then send message
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
    // update cooldown timestamp
	timestamps.set(msg.author.id, now);
	setTimeout(() => timestamps.delete(msg.author.id), cooldownAmount);

    /* Execute command */

    // try-catch to make sure we can notify the user if something goes wrong
	try {
		command.execute(msg, args, debug);
	} catch (err) {
		if (debug) console.error(err);
		msg.reply("there was an error trying to execute that command!");
	}
});

// Helper fuction: workaround for "fields.flat is not a function" issue by adding .flat() as a method to the Array prototype
Object.defineProperty(Array.prototype, 'flat', {
    value: function (depth = 1) {
        return this.reduce(function (flat, toFlatten) {
            return flat.concat((Array.isArray(toFlatten) && (depth > 1)) ? toFlatten.flat(depth - 1) : toFlatten);
        }, []);
    }
});