const _ = require("lodash");
var world = "C39CvegfC3B6ld-ottaviani";

const _help = require("./help.js");

exports.Main = function(cmd, chn, cont) {
	switch (cmd) {
		case "link":
			Link(chn, cont);
			break;
		default:
			_help.UnknownCommand(chn);
	}
}

function Link(chn, inputTitle) {
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
