
module.exports = {
	name: "timer",
	aliases: ["countdown","cd"],
	description: "Starts or stops a countdown timer.",
	args: true,
	usage: "timer [start|stop] [amount][s/m/h]",
	execute(msg, args) {
		
		const action = args.shift();
		switch (action) {
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
	//Start timer based on args
	chn.send("This will start a timer.");
}

function StopTimer(chn) {
	//Stop timer
	chn.send("This will stop the timer.");
}