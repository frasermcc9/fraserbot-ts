import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";
import { ServerSettingsModel } from "../../database/models/ServerSettings/ServerSettings.model";

export default class WikiEditCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "wikiedit",
            memberName: "wikiedit",
            aliases: ["wiki-edit", "wikie", "ewiki"],
            group: "wiki",
            description: "Edit a wiki entry",
            guildOnly: true,
        });
    }

    async run(message: CommandoMessage, {}: CommandArguments): Promise<Message> {
        return message.channel.send("Not implemented");
    }
}

interface CommandArguments {}
