module.exports = {
  name: "beverage",
  aliases: ["drink", "bev"],
  description:
    "Boris brings you a beverage - either of your choice or what he deems appropraite.",
  args: true,
  usage: "Bring me [amount] [random|drink_name]",
  execute(msg, args, debug) {
    const amount = args[0];
    const drink = args[1];
    switch (drink) {
      case "random":
        RandomDrink(msg.channel, amount, drink, debug);
        break;
      case "stop":
        ServeDrink(msg.channel, amount, drink, debug);
        break;
      default:
        ServeDrink(msg.channel, amount, drink, debug);
        return;
    }
  }
};

function RandomDrink(chn, amount, drink, debug) {
  drink = "beer";
  ServeDrink(chn, amount, drink);
}

function ServeDrink(chn, amount, drink, debug) {
  chn.send("Hello, itt is van " + amount + " " + drink);
}
