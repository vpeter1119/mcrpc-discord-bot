
const {prefix, defaultCooldown} = require ('../config.json');

module.exports = {
	name: 'help',
	aliases: ['commands','?'],
	description: 'List all commands or info about a specific command.',
	usage: '<command_name>',
	execute(msg, args) {
		const data = [];
		const {commands} = msg.client;
		
		if (!args.length) {
			data.push("Here's a list of all my commands:");
			data.push(commands.map(command => command.name).join('\n'));
			data.push(`\nYou can send \`${prefix}help <command_name>\` to get info on a specific command!`);
			
			return msg.author.send(data, {split:true})
				.then(() => {
					if (msg.channel.type === "dm") return;
					msg.reply("I have sent you a DM with all my commands!");
				})
				.catch(error => {
					console.error(`Could not send help DM to ${msg.author.tag}.\n`, error);
					msg.reply("it seems like I can't DM you! Do you have DMs disabled?");
				});
		}
		
		const name = args[0].toLowerCase();
		const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));
		
		if (!command) {
			return msg.reply("that's not a valid command!");
		}
		
		data.push(`**Name:** ${command.name}`);
		
		if (command.aliases) data.push(`**Aliases:** ${command.aliases.join(', ')}`);
		if (command.description) data.push(`**Description:** ${command.description}`);
		if (command.usage) data.push(`**Usage:** ${prefix}${command.usage}`);
		
		data.push(`**Cooldown:** ${command.cooldown || defaultCooldown} second(s)`);
		
		msg.channel.send(data, {split: true});
	}
}

