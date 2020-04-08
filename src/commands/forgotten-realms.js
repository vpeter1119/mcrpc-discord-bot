const _ = require("lodash");

exports.WikiLink = function(chn, inputTitle) {
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
