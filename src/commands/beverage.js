module.exports = {
    name: "beverage",
    aliases: ["drink", "bev"],
    description: "Boris brings you a beverage.",
    args: true,
    usage: "Bring me [amount] [random|drink_name]",
    execute(msg, args) {
        const amount = args[0];
        const drink = args[1];
        switch (drink) {
            case "random":
                RandomDrink(msg.channel, amount, drink);
                break;
            case "stop":
                ServeDrink(msg.channel, amount, drink);
                break;
            default:
                ServeDrink(msg.channel, amount, drink);
                return;
        }
    }
}

function RandomDrink(chn, amount, drink) {
    drink = "beer";
    ServeDrink(chn, amount, drink)
}

function ServeDrink(chn, amount, drink) {
    chn.send("Hello, itt is van " + amount + " " + drink);
}