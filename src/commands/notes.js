//const Discord = require("discord.js");
const fetch = require("node-fetch");
const config = require("../config/config");

const debug = global.debug;
const apiUrl = `${config.apiUrl}/notes/`;

let user = "";


module.exports = {
    name: "note",
    aliases: ["notes", "n"],
    description: "Save and retrieve notes, organized by categories.",
    args: true,
    usage: "note [add <Category> <Text> | get <Category>]",
    execute(msg, args) {
        user = `${msg.author.username}-${msg.author.discriminator}`;
        const action = args.shift();
        switch (action) {
            case "add":
                AddNote(msg, args);
                break;
            case "get":
                GetNotes(msg, args);
                break;
            default:
            return;
        }
    }
};

function AddNote(msg, data) {
    var category = data.shift();
    var text = data.join(" ");
    var data = {
        user: user,
        category: category,
        text: text
    };
    if (debug) console.log(data);
    // Create a new entry in database and handle the result with a callback function
    var url = `${apiUrl}?token=Mellon30190113`;
    fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => res.json()) // Maybe handle res.status?
        .then(json => {
            if (debug) console.log(json);
            if (json.message) msg.channel.send(json.message);
        });
}

async function GetNotes(msg, data) {
    // Get all notes based on user and category
    var category = data.shift();
    var url = `${apiUrl}/${user}?category=${category}`;
    if (debug) console.log(`Making GET request to ${url}`);
    const res = await fetch(url).then(response => response.json());
    if (res && res.ok && res.count > 0) {
        var notes = res.results;
        var text = `Itt vannak a mentett \`${category}\` jegyzeteid:`;
        notes.forEach(note => {
            text += `\n* ${note.text}`;
        });
        msg.author.send(text);
        return;
    } else {
        msg.channel.send("bocsi bástya, pont nem hallottam. Meg tudnád ismételni esetleg?");
    }
}
