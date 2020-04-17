
const {prefix, defaultCooldown} = require ('../config.json');

module.exports = {
	name: 'help',
	aliases: ['commands','?'],
	description: 'List all commands or info about a specific command.',
	usage: '<command_name>',
	execute(msg, args) {
		const data = [];
		const embed = {
			title: "Available Commands",
			descripton: `\nYou can send ${prefix}help [command_name] to get info on a specific command!`,
			fields: []
		};
		const {commands} = msg.client;
		
		if (!args.length) {
			/*data.push(commands.map(command => {
				return `\`${prefix}${command.name}\` (${command.aliases}) — ${command.description}`;
			}).join('\n')); */
			embed.fields.push(commands.map(command => {
				return {
					name: `**${command.name}**`,
					value: command.description,
					inline: false,
				}
			}));
			embed.fields.push({
				name: 'Other',
				value: `\nYou can send ${prefix}help [command_name] to get info on a specific command!`,
				inline: false,
			});
			
			return msg.author.send('', {embed: embed}, {split:true})
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

