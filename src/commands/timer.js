const Discord = require("discord.js");
const moment = require("moment");
let sentMsg = new Discord.Message();
var timer = null;

module.exports = {
	name: "timer",
	aliases: ["countdown","cd"],
	description: "Starts or stops a countdown timer.",
	args: true,
	usage: "timer [start|set|stop|end] [time in minutes] [message to display]",
	execute(msg, args) {
		
		const action = args.shift();
		switch (action) {
			case "start":
			case "set":
				StartTimer(msg, args);
				break;
			case "stop":
			case "end":
				StopTimer(msg);
				break;
			default:
				return;
		}
	}
}

function StartTimer(message, args) {
	//Expected syntax %timer start [timeToAdd] [txt]
	var timeToAdd = args.shift()*60;
	var txt = "";
	if (args) {
		txt = args.join(" ");
	} else {
		txt = "Timer";
	}
	if (timeToAdd > 3600) timeToAdd = 3600;
	var timeLeft = moment.duration({
		seconds: timeToAdd
	});
	timeLeft += 0; // this is strange
	var interval = 5000;
	message.channel.send(`${txt}: ${moment(timeLeft).format('mm:ss')}`)
	.then(msg => {
		sentMsg = msg;
	})
	.catch(error => {
		message.channel.send("Sorry, something went wrong. You can always try again, though.");
	});
	timer = setInterval(() => {	
		timeLeft -= interval;
		sentMsg.edit(`${txt}: ${moment(timeLeft).format('mm:ss')}`);
		if (timeLeft <= 0) {
			sentMsg.delete();
			message.reply("your timer expired!");
			clearInterval(timer);
		} 
	}, interval);
}

function StopTimer(message) {
	//Stop timer
	if (timer === null) return;
	sentMsg.delete();
	clearInterval(timer);
	message.channel.send("Timer stopped.");
}
