import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";
import { ServerSettingsModel } from "../../database/models/ServerSettings/ServerSettings.model";

export default class WikiDeleteCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "wikidelete",
            memberName: "wikidelete",
            aliases: ["wiki-delete", "wikid", "dwiki", "delwiki"],
            group: "wiki",
            description: "Delete a wiki entry (requires Wiki Manager, or admin).",
            guildOnly: true,
        });
    }

    async run(message: CommandoMessage, {}: CommandArguments): Promise<Message> {
        return message.channel.send("Not implemented");
    }
}

interface CommandArguments {}
