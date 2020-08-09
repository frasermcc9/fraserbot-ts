import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, MessageEmbed, Channel, MessageCollector, Collection } from "discord.js";
import { ServerSettingsModel } from "../../database/models/ServerSettings/ServerSettings.model";
import { findBestMatch } from "string-similarity";
import { MessageChannel } from "worker_threads";
import { promises } from "fs";

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
        let choice = title;
        if (title == "") {
            const output = new MessageEmbed().setTitle("Server Wiki").setDescription(titles.join("\n") ?? "Nothing");
            message.channel.send(output);
            choice = await this.getTitle(message);
        }
        const candidate = findBestMatch(choice, titles).bestMatch.target;
        const wikiEntry = entries[candidate];

        const output = new MessageEmbed()
            .setTitle(wikiEntry.title)
            .setDescription(wikiEntry.content)
            .setFooter(wikiEntry.authors[wikiEntry.authors.length - 1]);
        return message.channel.send(output);
    }

    private getTitle(message: CommandoMessage): Promise<string> {
        return new Promise((resolve, reject) => {
            const filter = (msg: Message) => message.author.id == msg.author.id;
            new MessageCollector(message.channel, filter, { time: 30 * 1000 }).once("collect", (collected: Message) => {
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
