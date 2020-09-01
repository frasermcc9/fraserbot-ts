import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";
import { ServerSettingsModel } from "../../database/models/Server/ServerSettings.model";
import { Bot } from "../../Bot";

export default class DadbotCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "dadbot",
            group: "config",
            memberName: "dadbot",
            description: "Toggle dadbot being enabled in this server.",
            userPermissions: ["ADMINISTRATOR"],
        });
    }

    async run(message: CommandoMessage): Promise<Message> {
        const guildSettings = await ServerSettingsModel.findOneOrCreate({ guildId: message.guild.id });

        const current = !(guildSettings.dadBot ?? false);
        await guildSettings.setDadbot({ setting: current });
        Bot.Get.refreshCachePoint(guildSettings);
        return message.channel.send(`Dadbot is now ${current ? "enabled" : "disabled"} in this server!`);
    }
}
