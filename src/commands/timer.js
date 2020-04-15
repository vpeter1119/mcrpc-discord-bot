const Discord = require("discord.js");
let sentMsg = new Discord.Message();
var timer = null;

module.exports = {
	name: "timer",
	aliases: ["countdown","cd"],
	description: "Starts or stops a countdown timer.",
	args: true,
	usage: "timer [start|stop] [time in seconds]",
	execute(msg, args) {
		
		const action = args.shift();
		switch (action) {
			case "start":
				StartTimer(msg, args);
				break;
			case "stop":
				StopTimer(msg);
				break;
			default:
				return;
		}
	}
}

function StartTimer(message, args) {
	//Start timer based on args
	var timeToAdd = args[0];
	var txt = "";
	if (args.indexOf("-m") > -1) {
		txt = args[((args.indexOf("-m"))+1)];
	} else {
		txt = "Timer";
	}
	if (timeToAdd > 3600) timeToAdd = 3600; 
	var now = new Date().getTime();
	var expireTime = now + (timeToAdd*1000);
	var timeLeft = expireTime - now;
	message.channel.send(`${txt}: ${timeLeft/1000} second(s) left`)
	.then(msg => {
		sentMsg = msg;
	});
	timer = setInterval(() => {	
		timeLeft -= 1000;
		sentMsg.edit(`${txt}: ${timeLeft/1000} second(s) left`);
		if (timeLeft == 0) {
			sentMsg.delete();
			message.reply("your timer expired!");
			clearInterval(timer);
		} 
	}, 1000);
}

function StopTimer(message) {
	//Stop timer
	if (timer === null) return;
	sentMsg.delete();
	clearInterval(timer);
	message.channel.send("Timer stopped.");
}