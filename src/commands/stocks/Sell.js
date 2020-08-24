const { Command, CommandoMessage } = require("discord.js-commando");
const { MessageEmbed, Message, GuildMember } = require("discord.js");
const { Client, UserAction, Symbol } = require("stocksim");
const { default: Util } = require("../../helpers/OutputHelper");

module.exports = class SellCommand extends Command {
	constructor(client) {
		super(client, {
			name: "sell",
			aliases: ["sellstock", "sellnow", "divest", "sellorder", "$s"],
			memberName: "sell",
			group: "stocks",
			description: "Sell a particular stock",
			guildOnly: false,
			clientPermissions: ["SEND_MESSAGES"],
			args: [
				{
					key: "symbol",
					prompt: "What is the symbol of the stock?",
					type: "string",
				},
				{
					key: "sellQuantity",
					prompt: "How many shares are you wanting to sell?",
					type: "string",
				},
			],
		});
	}
	/**
	 * @param {CommandoMessage} msg
	 * @param {object} param1
	 * @param {string} param1.Symbol
	 * @param {string} param1.sellQuantity
	 */
	async run(msg, { symbol, sellQuantity }) {
		let result;
		let investor = new UserAction(msg.author.id);
		if (sellQuantity.toLowerCase() == "all" || sellQuantity.toLowerCase() == "a") {
			result = await investor.SellAllShares(symbol, msg.author.id).catch(() => {
				msg.say("Sorry I do not know what symbol that refers to.");
			});
			sellQuantity = result.holding;
		} else {
			sellQuantity = Math.abs(parseFloat(sellQuantity));
			if (isNaN(sellQuantity)) return msg.say("The amount you entered to sell could not be interpreted as a number.");
			result = await investor.SellShares(sellQuantity, symbol, msg.author.id).catch(() => {
				msg.say("Sorry I do not know what symbol that refers to.");
			});
		}

		if (!result) return;
		if (result.success) {
			const output = new MessageEmbed()
				.setTitle("Success")
				.setAuthor("Stock Simulator")
				.setDescription(`You sold ${sellQuantity} shares in $${symbol.toUpperCase()} for $${Util.delimit((sellQuantity * result.price).toFixed(2))}!`)
				.setColor("#24c718")
				.setFooter(`Data provided by IEXCloud.`)
				.setThumbnail("https://upload.wikimedia.org/wikipedia/en/e/e4/Green_tick.png");
			return msg.say(output);
		} else {
			return msg.say("Please double check if you own sufficient shares.");
		}
	}
};
