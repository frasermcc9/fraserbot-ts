import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, MessageEmbed, Channel, MessageCollector, Collection } from "discord.js";
import { ServerSettingsModel } from "../../database/models/ServerSettings/ServerSettings.model";
import { promises } from "fs";


export default class WikiViewCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "wikiback",
            memberName: "wikiback",
            group: "wiki",
            description: "Add in old wiki entries.",
            guildOnly: true,

        });
    }
   
    async run(message: CommandoMessage): Promise<Message> {
        const data:JsonData = require("../Json/data.json")
        const serverSettings = await ServerSettingsModel.findOneOrCreate({ guildId: message.guild.id });
        for (const title in data) {
            if (Object.prototype.hasOwnProperty.call(data, title)) {
                const contentAndAuthor = data[title];
                await serverSettings.updateWikiEntry({
                    title: title,
                    content: contentAndAuthor.content,
                    author: contentAndAuthor.author,
                })
            }   
        }
        return message.channel.send("I'm done never touch me again\n||die||");
    }
}

interface JsonData {
    [k: string]: {
        content: string;
        author: string;
    };
}
