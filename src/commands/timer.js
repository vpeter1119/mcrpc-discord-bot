
module.exports = {
	name: "timer",
	aliases: ["countdown","cd"],
	description: "Starts or stops a countdown timer.",
	args: true,
	usage: "timer [start|stop] [amount][s/m/h]",
	execute(msg, args) {
		//Code here
		const set = args.shift();
		console.log("FCG command: "+set);
		switch (set) {
			case "start":
				StartTimer(msg.channel, args);
				break;
			case "stop":
				StopTimer(msg.channel, args);
				break;
			default:
				return;
		}
	}
}

function StartTimer(chn, args) {
	//Starts timer
	chn.send("This will start a timer.");
}

function StopTimer(chn) {
	//Stops timer
	chn.send("This will stop the timer.");
}