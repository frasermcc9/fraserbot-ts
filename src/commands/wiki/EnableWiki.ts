import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";
import { ServerSettingsModel } from "../../database/models/Server/ServerSettings.model";

export default class EnableWikiCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "enablewiki",
            aliases: ["togglewiki"],
            group: "wiki",
            memberName: "enablewiki",
            description: "Toggle wiki being enabled in this server.",
            userPermissions: ["ADMINISTRATOR"],
        });
    }

    async run(message: CommandoMessage): Promise<Message> {
        const guildSettings = await ServerSettingsModel.findOneOrCreate({ guildId: message.guild.id });

        const current = !(guildSettings.wiki.enabled ?? false);
        await guildSettings.setWikiEnabled({ setting: current });
        return message.channel.send(`Wiki is now ${current ? "enabled" : "disabled"} in this server!`);
    }
}
