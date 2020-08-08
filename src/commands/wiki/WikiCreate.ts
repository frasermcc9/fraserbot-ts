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
        });
    }

    async run(message: CommandoMessage, {}: CommandArguments): Promise<Message> {
        return message.channel.send("Not implemented");
    }
}

interface CommandArguments {}
