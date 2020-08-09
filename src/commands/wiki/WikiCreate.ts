import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";
import { ServerSettingsModel } from "../../database/models/ServerSettings/ServerSettings.model";

export default class WikiCreateCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "wikicreate",
            memberName: "wikicreate",
            aliases: ["wiki-create", "wikic", "cwiki"],
            group: "wiki",
            description: "Create a wiki entry",
            guildOnly: true,
            args: [
                {
                    key: "title",
                    prompt: "What wiki entry would you like to create?",
                    type: "string",
                },
                {
                    key: "content",
                    prompt: "What is the content of this page?",
                    type: "string",
                    wait: 60 * 10,
                },
            ],
        });
    }

    async run(message: CommandoMessage, { content, title }: CommandArguments): Promise<Message> {
        const serverSettings = await ServerSettingsModel.findOneOrCreate({ guildId: message.guild.id });
        if (!serverSettings.wiki.enabled) {
            return message.channel.send("The wiki is not enabled in this server. An admin can enable it.");
        }
        if (serverSettings.getWikiEntry({ title: title }) != undefined) {
            return message.channel.send("This wiki entry already exists!");
        } else {
            await serverSettings.updateWikiEntry({
                title: title,
                content: content,
                author: message.member.displayName,
            });
            return message.channel.send(`Wiki entry **${title}** created!`);
        }
    }
}

interface CommandArguments {
    title: string;
    content: string;
}
