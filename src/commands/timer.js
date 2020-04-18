const Discord = require("discord.js");
let sentMsg = new Discord.Message();

// global variables
let timer = null; // running timer
let txt = ""; // timer name
let interval = 5; // initial interval in seconds
let currentTimeObj = { // initializing time object
    "h": 0,
    "m": 0,
    "s": 0
};
let timeLeft = 0; // moving counter
let modifying = false; // bool to track if in-modification between intervals

module.exports = {
	name: "timer",
	aliases: ["countdown","cd"],
	description: "Starts or stops a countdown timer - to which you can add to / subtract from.",
	args: true,
	usage: "timer [start|set|stop|end|add|plus|sub|subtract] [time in hh:mm:ss or mm:ss or mm format] [message to display]",
	execute(msg, args) {
		const action = args.shift();
		switch (action) {
			case "start":
            case "set":
                if (timer === null) {
                    StartTimer(msg, args);
                } else {
                    msg.channel.send(`There is a timer running already.`);
                    return;
                }
				break;
			case "stop":
            case "end":
                if (timer === null) {
                    msg.channel.send(`There is no running timer.`);
                    return;
                } else {
                    StopTimer(msg);
                }
                break;
            case "add":
            case "+":
            case "plus":
                if (timer === null) {
                    msg.channel.send(`There is no running timer.`);
                    return;
                } else {
                    modifyTimer(msg, args, "add");
                }
                break;
            case "sub":
            case "-":
            case "subtract":
                if (timer === null) {
                    msg.channel.send(`There is no running timer.`);
                    return;
                } else {
                    modifyTimer(msg, args, "sub");
                }
                break;
			default:
				return;
		}
	}
}

function StartTimer(message, args) {
	//Expected syntax %timer start [timeToAdd] [txt]
    var timeInput = args.shift().split(":");

    // process time input
    currentTimeObj = processInput(currentTimeObj, timeInput);
    if (!currentTimeObj) {
        message.channel.send(`The provided format seems to be invalid. Are you sure you entered hh:mm:ss or mm:ss or mm?`);
        return;
    }

    // process text input. if there is none, then "Timer" is set
    txt = args.length > 0 ? args.join(" ") : "Timer";

    // set up timer
    var timeInSeconds = currentTimeObj.h * 3600 + currentTimeObj.m * 60 + currentTimeObj.s;
    if (timeInSeconds > 21600) {
        message.channel.send(`You tried to launch a timer for more than 6 hours. That's too much, sorry.`);
        return;
    }

    timeLeft = timeInSeconds; // this timeLeft will be our moving counter, initializing it as the first input 
    updateInterval(timeLeft); // sets starting interval

    message.channel.send(`${txt}: ${setTimeDisplay(currentTimeObj,timeLeft)}`)
	.then(msg => {
		sentMsg = msg;
	})
	.catch(error => {
		message.channel.send("Sorry, something went wrong. You can always try again, though.");
	});
    timer = setInterval(() => {	
        // if we are currently modifying then time and timeLeft are already set but we need to swithc the bool back to false
        if (modifying) {
            modifying = false;
        } else {
            timeLeft -= interval;
            currentTimeObj = updateTimeObjectsFromSeconds(timeLeft, currentTimeObj);
        }

        updateInterval(timeLeft);

        sentMsg.edit(`${txt}: ${setTimeDisplay(currentTimeObj,timeLeft)}`);
		if (timeLeft <= 0) {
			sentMsg.delete();
			message.reply("your timer expired!");
            clearInterval(timer);
            timer = null;
		} 
	}, interval*1000);
}

function StopTimer(message) {
	sentMsg.delete();
    clearInterval(timer);
    timer = null;
	message.channel.send("Timer stopped.");
}

function modifyTimer(message, args, action) {
    modifying = true;

    var timeToAdd = {
        "h": 0,
        "m": 0,
        "s": 0
    };

    timeToAdd = processInput(timeToAdd, args.shift().split(":"));

    if (action == "add") {
        currentTimeObj.h += timeToAdd.h;
        currentTimeObj.m += timeToAdd.m;
        currentTimeObj.s += timeToAdd.s;
    } else if (action == "sub") {
        currentTimeObj.h -= timeToAdd.h;
        currentTimeObj.m -= timeToAdd.m;
        currentTimeObj.s -= timeToAdd.s;
    }
    
    timeLeft = currentTimeObj.h * 3600 + currentTimeObj.m * 60 + currentTimeObj.s;
    sentMsg.edit(`${txt}: ${setTimeDisplay(currentTimeObj, timeLeft)}`);
    if (timeLeft <= 0) {
        sentMsg.delete();
        message.reply("Your timer expired!");
        clearInterval(timer);
    } 
}


// Helper function: to update refresh interval based on current time left. NOTE: updating every second gets very laggy due to communication being slow
function updateInterval(seconds) {
    if (seconds > 3600) {
        interval = 10
    } else if (seconds < 60) {
        interval = 3;
    } else {
        interval = 5;
    }
}

// Helper function: creates a nice, readable time format from seconds and returns a string to display
function setTimeDisplay(timeObject, seconds) {
    var retStr = "";
    if (seconds >= 3600) {
        retStr = timeObject.h.toString().padStart(2, "0") + ":" + timeObject.m.toString().padStart(2, "0") + ":" + timeObject.s.toString().padStart(2, "0")
    } else if (seconds >= 60) {
        retStr = timeObject.m.toString().padStart(2, "0") + ":" + timeObject.s.toString().padStart(2, "0")
    } else {
        retStr = timeObject.s.toString().padStart(2, "0")
    }

    return retStr;
}

// Helper function: takes a time object and current seconds and returns the time object updated with the seconds
function updateTimeObjectsFromSeconds(seconds, timeObj) {
    timeObj.h = Math.floor(seconds / 3600);
    timeObj.m = Math.floor((seconds - (3600 * timeObj.h)) / 60);
    timeObj.s = seconds - (3600 * timeObj.h) - 60 * timeObj.m;

    return timeObj;
}

// Helper function: reads user input and formats it to a time object
function processInput(timeObj, timeInput) {
    var secs = 0;
    if (timeInput.length == 1) {
        secs = parseInt(timeInput[0]) * 60;
    } else if (timeInput.length == 2) {
        secs = parseInt(timeInput[0]) * 60 + parseInt(timeInput[1])
    } else if (timeInput.length == 3) {
        secs = parseInt(timeInput[0]) * 3600 + parseInt(timeInput[1]) * 60 + parseInt(timeInput[2])
    } else {
        return null;
    }

    timeObj = updateTimeObjectsFromSeconds(secs, timeObj);
    return timeObj;
}