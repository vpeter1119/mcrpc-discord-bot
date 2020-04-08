
const FantasyName = require("fantasy-name/fantasy-name");
const fantasyName = new FantasyName(); //

exports.GenerateRandomNames = function(chn, nr) {
  var names = fantasyName.getName(nr);
  console.log(names);
  chn.send(names);
};
