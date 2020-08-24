const { Command, CommandoMessage } = require("discord.js-commando");
const { MessageEmbed, GuildMember } = require("discord.js");
const { Client, UserAction, Symbol } = require("stocksim");
const { default: Util } = require("../../helpers/OutputHelper");

module.exports = class NetCommand extends Command {
	constructor(client) {
		super(client, {
			name: "net",
			aliases: ["networth", "holdings", "assets", "$n"],
			memberName: "net",
			group: "stocks",
			description: "View your (or someone elses) net worth.",
			guildOnly: false,
			clientPermissions: ["SEND_MESSAGES"],
			args: [
				{
					type: "member",
					prompt: "Who's net wealth would you like to see",
					key: "member",
					default: (msg) => msg.member,
				},
			],
		});
	}
	/**
	 * @param {CommandoMessage} msg
	 * @param {object} param1
	 * @param {GuildMember} param1.member
	 */
	async run(msg, { member }) {
		const uid = member.id;
		const investor = new UserAction(uid);
		await investor.SetUserCache();
		const data = await Promise.all([investor.NetAssetWorth(), investor.FreeCapital()]);
		const Total = (data[0] + data[1]).toFixed(2);
		const StockAssets = data[0].toFixed(2);
		const FreeCapital = data[1].toFixed(2);

		if (StockAssets && FreeCapital) {
			const output = new MessageEmbed()
				.setTitle(`${member.nickname || member.displayName}'s Net Worth`)
				.setDescription(`$${Util.delimit(Total)}`)
				.addField(`Composition`, `Free Capital: $${Util.delimit(FreeCapital)}\nStocks: $${Util.delimit(StockAssets)}`)
				.setColor("#24c718")
				.setFooter(`Data provided by IEXCloud.`)
				.setThumbnail(member.user.avatarURL());
			return msg.say(output);
		} else {
			return msg.say("An error occurred. It was probably temporary and now resolved.");
		}
	}
};
