
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
  },
  {
    syntax: "`%fcg name`",
    desc:
      " - a Fantasy Content Generator segítségével generál egy random nevet, fajjal és nemmel."
  },
  {
    syntax: "`%fcg npc`",
    desc:
      " - a Fantasy Content Generator segítségével generál egy random NPC-t, fajjal és nemmel, valamint néhány személyiségjeggyel."
  },
];

exports.Help = function(chn) {
  var msgData = "A jelenleg elérhető parancsok:\n\n";
  commands.forEach(cmd => {
  msgData = msgData + cmd.syntax + cmd.desc + "\n\n";
  });
  chn.send(msgData);
};

exports.UnknownCommand = function(chn) {
  chn.send(
    "Ezt a parancsot nem ismerem. Az elérhető parancsok megjelenítéséhez használd a `%help` parancsot!"
  );
};
