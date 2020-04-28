const Discord = require("discord.js");
let tempMsg = new Discord.Message();
const fetch = require("node-fetch");

const webModules = require("../web/modules/modules.js");
const debug = global.debug;
apiUrl = "http://mcrpc-server.petervertesi.com/api/moments";


module.exports = {
    name: "moments",
    aliases: ["moment", "mom"],
    description: "Used store and bring up memorable RPG moments.",
    args: true,
    usage: "moments [add <From> <Text> | random| name (from)]",
    execute(msg, args) {
        const action = args.shift();
        switch (action) {
            case "add":
            AddMoment(msg, args);
            break;
            case "random":
            MomentRandom(msg);
            break;
            default:
            MomentAdvanced(msg, action, args);
            return;
        }
    }
};

function AddMoment(msg, data) {
    var from = data.shift();
    var text = data.join(" ");
    // Create a new entry in database and handle the result with a callback function
    webModules.moments.Create(from, text, result => {
        if (result && result.ok) {
            msg.reply("HEHE ez tetszik, fel is írtam magamnak.");
        } else {
            if (debug) {
            console.log("ERROR!");
            console.log(result.error);
            }
            msg.reply("bocsi bástya, pont nem hallottam. Meg tudnád ismételni esetleg?");
        }
    });
}

async function MomentRandom(msg) {
    // Get all moments from database and handle the result with a callback function
    var url = apiUrl;
    if (debug) console.log(`Making GET request to ${url}`);
    const res = await fetch(url).then(response => response.json());
    if (res && res.ok && res.count > 0) {
        var moments = res.results;
        var i = Math.floor(Math.random() * moments.length);
        var moment = moments[i];
        msg.channel.send("", {
            embed: { title: `${moment.from}: ${moment.text}` }
        });
        return;
    } else {
        msg.channel.send("bocsi bástya, pont nem hallottam. Meg tudnád ismételni esetleg?");
    }
}

async function MomentAdvanced(msg, action, args) {
    var from = action;
    // First we check the 'from' key
    var url = apiUrl + "?from=" + from;
    if (debug) console.log(`Making GET request to ${url}`);
    const res = await fetch(url).then(response => response.json()); 
    if (res && res.ok && res.count > 0) {
        var moments = res.results;
        var i = Math.floor(Math.random() * moments.length);
        var moment = moments[i];
        msg.channel.send("", {
            embed: { title: `${moment.from}: ${moment.text}` }
        });
        return;
    } else {
        msg.channel.send(`${action}? Az meg kicsoda?`);
    }
    // Then we search in the text
    console.log("after return");
}
