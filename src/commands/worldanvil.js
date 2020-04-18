
const _ = require("lodash");
const {world} = require("../config/config.js");

module.exports = {
	name: "worldanvil",
	aliases: ["wa","anvil","üvegföld"],
	description: "Creates a link to the specified article on WorldAnvil.",
	args: true,
	usage: "`wa link <article_title>`",
	execute(msg, args) {
		//Code here
		const action = args.shift();
		console.log("WA command: "+action);
		if (action === "link") {
			Link(msg.channel, args.join(' '));
		}
	}
}

function Link(chn, inputTitle) {
	if (!inputTitle.length) {
		chn.send("http://worldanvil.com");
		return;
	}
	var titleAsRequested = inputTitle;
	console.log(titleAsRequested);
	var title = titleAsRequested.replace(/'/g, "");
	console.log(title);
	title = title.replace(/"/g, "-");
	console.log(title);
	title = title.replace(/ /g, "-");
	console.log(title);
	title = title.replace(/á/g, "a");
	title = title.replace(/é/g, "e");
	console.log(title);
	title = encodeURIComponent(title).replace(/%/g, "");
	console.log(title);
	title = _.toLower(title);
	console.log(title);
	title = _.replace(title, " ", "-");
	console.log(title);
	var url =
	"https://www.worldanvil.com/w/" + world + "/a/" + title + "-article";
	var msgData =
	"Here is a link to the WorldAnvil article '**" +
	titleAsRequested +
	"**':\n" +
	url;
	chn.send(msgData);
};
