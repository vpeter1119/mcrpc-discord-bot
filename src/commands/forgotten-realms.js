
module.exports = {
	name: "forgotten-realms",
	aliases: ["fr","forgottenrealms"],
	description: "Creates a link to the specified article on the Forgotten Realms Wiki.",
	args: true,
	usage: "`fr wiki <article_title>`",
	execute(msg, args) {
		//Code here
		const action = args.shift();
		console.log("FR command: "+action);
		if (action === "wiki") {
			WikiLink(msg.channel, args.join(' '));
		}
	}
}

function WikiLink (chn, inputTitle) {
	if (!inputTitle.length) {
		chn.send("https://forgottenrealms.fandom.com");
		return;
	}
	var titleAsRequested = inputTitle;
	var title = titleAsRequested.replace(/ /g, "_");
	var url = "https://forgottenrealms.fandom.com/wiki/" + title;
	var msgData =
	"Here is a link to the Forgotten Realms Wiki article '**" +
	titleAsRequested +
	"**':\n" +
	url;
	chn.send(msgData);
};
