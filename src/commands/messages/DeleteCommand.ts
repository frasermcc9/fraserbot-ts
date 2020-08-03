import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, GuildMember, MessageEmbed } from "discord.js";
import { ServerSettingsModel } from "../../database/models/ServerSettings/ServerSettings.model";
import { Bot } from "../../Bot";

export default class DeleteCommandCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "deletecommand",
            aliases: ["deletecmd", "delcmd", "delete-server-commands"],
            group: "messages",
            memberName: "deletecommand",
            description: "Delete a custom command from this guild.",
            guildOnly: true,
            userPermissions: ["MANAGE_GUILD"],
            args: [
                {
                    key: "command",
                    prompt: "What is the name of the command you'd like to add?",
                    type: "string",
                    validate: (s: string) => s.length < 64,
                },
            ],
        });
    }

    async run(message: CommandoMessage, { command }: { command: string }): Promise<Message> {
        command = command.toLowerCase();
        const guildSettings = await ServerSettingsModel.findOneOrCreate({ guildId: message.guild.id });
        const result = await guildSettings.deleteCommand({ name: command });
        Bot.Get.refreshCachePoint(guildSettings);

        if (result) return message.channel.send(`Command with name **${command}** deleted!`);
        else return message.channel.send(`Command with name **${command}** already doesn't exist.`);
    }
}
