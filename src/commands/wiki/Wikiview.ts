import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, MessageEmbed, MessageCollector } from "discord.js";
import { ServerSettingsModel } from "../../database/models/Server/ServerSettings.model";
import { findBestMatch } from "string-similarity";
import OutputHelper from "../../helpers/OutputHelper";

export default class WikiViewCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "wikiview",
            memberName: "wikiview",
            aliases: ["wiki-view", "wikiv", "vwiki"],
            group: "wiki",
            description: "View a wiki entry.",
            guildOnly: true,
            args: [
                {
                    key: "title",
                    prompt: "What wiki entry would you like to see?",
                    type: "string",
                    default: "",
                },
            ],
        });
    }

    async run(message: CommandoMessage, { title }: CommandArguments): Promise<Message> {
        const serverSettings = await ServerSettingsModel.findOneOrCreate({ guildId: message.guild.id });
        if (!serverSettings.wiki.enabled) {
            return message.channel.send("The wiki is not enabled in this server. An admin can enable it.");
        }
        const entries = serverSettings.getAllWikiEntries();
        const titles = Object.keys(entries);
        if (titles.length == 0) {
            return message.channel.send("There are no wiki entries in this server.");
        }
        let choice = title;
        if (title == "") {
            const ordered = OutputHelper.makeAlphabetical(titles.slice());
            const chunks = OutputHelper.chunkSplit(ordered, 3);
            const output = new MessageEmbed()
                .setTitle("Pages in this Server's Wiki")
                .setDescription("Reply with a page")
                .addField("Page 1⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", chunks[0].join("\n") || "(None)", true)
                .addField("Page 2⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", chunks[1].join("\n") || "(None)", true)
                .addField("Page 3⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀", chunks[2].join("\n") || "(None)", true)
                .setThumbnail(
                    message.guild.iconURL() ??
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7d/Question_opening-closing.svg/78px-Question_opening-closing.svg.png"
                )
                .setColor("#11d486");
            message.channel.send(output);
            try {
                choice = await this.getTitle(message);
            } catch {
                return message.channel.send("No reply was provided in time.");
            }
        }
        const candidate = findBestMatch(choice, titles).bestMatch.target;
        const wikiEntry = entries[candidate];

        const output = new MessageEmbed()
            .setTitle(wikiEntry.title)
            .setDescription(wikiEntry.content)
            .setFooter(wikiEntry.authors[wikiEntry.authors.length - 1])
            .setColor("#8c11d4");
        return message.channel.send(output);
    }

    private getTitle(message: CommandoMessage): Promise<string> {
        return new Promise((resolve, reject) => {
            const filter = (msg: Message) => message.author.id == msg.author.id;
            new MessageCollector(message.channel, filter, { time: 30 * 1000 })
                .once("collect", (collected: Message) => {
                    const content: string = collected.content;
                    resolve(content);
                })
                .once("end", () => {
                    reject("No reply in time.");
                });
        });
    }
}

interface CommandArguments {
    title: string;
}
