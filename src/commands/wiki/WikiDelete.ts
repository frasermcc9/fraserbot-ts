import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, MessageEmbed, MessageCollector } from "discord.js";
import { ServerSettingsModel } from "../../database/models/ServerSettings/ServerSettings.model";
import { findBestMatch } from "string-similarity";

export default class WikiDeleteCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "wikidelete",
            memberName: "wikidelete",
            aliases: ["wiki-delete", "wikid", "dwiki", "delwiki"],
            group: "wiki",
            description: "Delete a wiki entry (requires Wiki Manager, or admin).",
            guildOnly: true,
            args: [
                {
                    key: "title",
                    prompt: "What is the name of the entry you would like to delete?",
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
        const managerRole = serverSettings.getWikiContentManager();

        const roleObj = message.guild.roles.resolve(managerRole ?? "");

        if (!message.member.roles.cache.has(roleObj?.id ?? "") && !message.member.hasPermission("ADMINISTRATOR")) {
            return message.channel.send(
                "You do not have the wiki manager role, you cannot delete content with the delete command. You must use the edit command."
            );
        }

        const entries = serverSettings.getAllWikiEntries();
        const titles = Object.keys(entries);
        if (titles.length == 0) {
            return message.channel.send("There are no wiki entries in this server.");
        }
        let choice = title;
        if (title == "") {
            const output = new MessageEmbed().setTitle("Server Wiki").setDescription(titles.join("\n") ?? "Nothing");
            message.channel.send(output);
            choice = await this.getTitle(message);
        }
        const candidate = findBestMatch(choice, titles).bestMatch.target;
        message.channel.send(`Please type **YES** to confirm deletion of article ${candidate}.`);
        const confirmed = await this.confirmDeletion(message);
        if (confirmed) {
            const deleted = await serverSettings.deleteWikiEntry({ title: candidate });
            if (deleted) return message.channel.send(`Article ${candidate} was permanently deleted.`);
            if (!deleted) return message.channel.send(`Article ${candidate} was not found.`);
        }
        return message.channel.send("Deletion was cancelled.");
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

    private confirmDeletion(message: CommandoMessage): Promise<boolean> {
        return new Promise((resolve, reject) => {
            const filter = (msg: Message) => message.author.id == msg.author.id;
            new MessageCollector(message.channel, filter, { time: 30 * 1000 })
                .once("collect", (collected: Message) => {
                    const content: string = collected.content;
                    if (content == "YES") {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                })
                .once("end", () => {
                    resolve(false);
                });
        });
    }
}

interface CommandArguments {
    title: string;
}
