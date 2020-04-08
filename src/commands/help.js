
var commands = [
  {
    syntax: "`%help`",
    desc: " - kiírja ezt az üzenetet, de ezt valószínűleg már amúgy is tudod."
  },
  {
    syntax: "`%wa link <article_title>`",
    desc:
      " - megpróbál készíteni egy linket a megfelelő cikkre az Üvegföld WorldAnvil oldalon."
  },
  {
    syntax: "`%fr wiki <article_title>`",
    desc:
      " - megpróbál készíteni egy linket a megfelelő cikkre a Forgotten Realms Wiki oldalon."
  }
];

exports.Help = function(chn) {
  var msgData = "A jelenleg elérhető parancsok:\n\n";
  commands.forEach(cmd => {
    msgData = msgData + cmd.syntax + cmd.desc + "\n";
  });
  chn.send(msgData);
};

exports.UnknownCommand = function(chn) {
  chn.send(
    "Ezt a parancsot nem ismerem. Az elérhető parancsok megjelenítéséhez használd a `%help` parancsot!"
  );
};
