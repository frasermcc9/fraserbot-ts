const { Command, CommandoMessage } = require("discord.js-commando");
const { MessageEmbed, Message, GuildMember } = require("discord.js");
const { Client, UserAction, Symbol } = require("stocksim");
const { default: Util } = require("../../helpers/OutputHelper");

module.exports = class BuyCommand extends Command {
	constructor(client) {
		super(client, {
			name: "buy",
			aliases: ["buystock", "buynow", "purchase", "order", "marketorder", "$b"],
			memberName: "buy",
			group: "stocks",
			description: "Buy a particular stock",
			guildOnly: false,
			clientPermissions: ["SEND_MESSAGES"],
			args: [
				{
					key: "symbol",
					prompt: "What is the symbol of the stock?",
					type: "string",
				},
				{
					key: "spend",
					prompt: "How much money worth of stock would you like to buy?",
					type: "float",
				},
			],
		});
	}
	/**
	 * @param {CommandoMessage} msg
	 * @param {object} param1
	 * @param {string} param1.symbol
	 * @param {number} param1.spend
	 */
	async run(msg, { symbol, spend }) {
		spend = Math.abs(spend);
		const investor = new UserAction(msg.author.id);
		const result = await investor.BuySharesReturnSharePrice(spend, symbol).catch(() => {
			msg.say("Sorry I do not know what symbol that refers to.");
		});
		if (!result) return;
		if (result.success) {
			const output = new MessageEmbed()
				.setTitle("Success")
				.setAuthor("Stock Simulator")
				.setDescription(`You bought ${spend / result.price} $${symbol.toUpperCase()} shares for $${Util.delimit(spend.toFixed(2))}!`)
				.setColor("#24c718")
				.setFooter(`Data provided by IEXCloud.`)
				.setThumbnail("https://upload.wikimedia.org/wikipedia/en/e/e4/Green_tick.png");
			return msg.say(output);
		} else {
			return msg.say("Please double check the funds in your account.");
		}
	}
};
