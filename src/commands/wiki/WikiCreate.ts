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
                    prompt: "What wiki entry would you like to see?",
                    type: "string",
                },
                {
                    key: "content",
                    prompt: "What wiki entry would you like to see?",
                    type: "string",
                    wait: 60 * 10,
                },
            ],
        });
    }

    async run(message: CommandoMessage, {}: CommandArguments): Promise<Message> {
        const serverSettings = await ServerSettingsModel.findOneOrCreate({ guildId: message.guild.id });
        if (!serverSettings.wiki.enabled) {
            return message.channel.send("The wiki is not enabled in this server. An admin can enable it.");
        }
        
    }
}

interface CommandArguments {}
