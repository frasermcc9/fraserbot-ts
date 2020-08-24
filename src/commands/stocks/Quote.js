const { Command, CommandoMessage } = require("discord.js-commando");
const { MessageEmbed, Message, GuildMember } = require("discord.js");
const { Client, UserAction, Symbol } = require("stocksim");
const { default: Util } = require("../../helpers/OutputHelper");

module.exports = class QuoteCommand extends Command {
    constructor(client) {
        super(client, {
            name: "quote",
            aliases: ["td", "today", "quo", "$q"],
            memberName: "quote",
            group: "stocks",
            description: "Get a quote for a symbol",
            guildOnly: false,
            clientPermissions: ["SEND_MESSAGES"],
            args: [
                {
                    key: "symbol",
                    prompt: "What is the symbol of the stock?",
                    type: "string",
                },
            ],
        });
    }
    /**
     * @param {CommandoMessage} msg
     * @param {object} param1
     * @param {string} param1.symbol
     */
    async run(msg, { symbol }) {
        const sym = new Symbol(symbol);
        const data = await Promise.all([
            sym.FullQuote().catch(() => msg.say("I cannot figure out what symbol that refers to.")),
            sym.CompanyLogo().catch(() => {}),
        ]);
        const quote = data[0];
        const img = data[1];
        if (quote) {
            const emoji = quote.change < 0 ? ":chart_with_downwards_trend:" : ":chart_with_upwards_trend:";
            const color = quote.change < 0 ? "#f22e1f" : "#24c718";
            const operator = quote.change < 0 ? "" : "+";

            const output = new MessageEmbed()
                .setTitle(`Data for ${quote.companyName} (${quote.primaryExchange}: ${quote.symbol})`)
                .setDescription(
                    `**${quote.latestPrice}** USD${Util.tab() + "||" + Util.tab()} ${operator} ${quote.change} (${
                        quote.changePercent * 100
                    }%) ${emoji}`
                )
                .addField(
                    Util.tab() + Util.tab() + Util.tab(),
                    `**Open: $** ${quote.open}\n**High: $** ${quote.high}\n**P/E Ratio: **${quote.peRatio}\n**Avg Vol: **${quote.avgTotalVolume}` +
                        Util.tab(),
                    true
                )
                .addField(
                    Util.tab() + Util.tab() + Util.tab(),
                    `**Close: $**${quote.close}\n**Low: $**${quote.low}\n**Market Cap: $**${Util.delimit(
                        quote.marketCap
                    )}\n**52Wk High: $**${Util.delimit(quote.week52High)}`,
                    true
                )
                .setFooter(`Data provided by IEXCloud. Price Source: ${quote.latestSource}`)
                .setColor(color);
            if (img) {
                output.setThumbnail(img.url);
            }
            return msg.say(output);
        } else {
            return msg.say("I cannot figure out what symbol that refers to.");
        }
    }
};
