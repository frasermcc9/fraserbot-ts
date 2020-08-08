import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";
import { ServerSettingsModel } from "../../database/models/ServerSettings/ServerSettings.model";
import { findBestMatch } from "string-similarity";

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

    async run(message: CommandoMessage, {}: CommandArguments): Promise<Message> {
        return message.channel.send("Not implemented");
    }
}

interface CommandArguments {}
