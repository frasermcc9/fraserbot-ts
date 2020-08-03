import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, GuildMember, MessageEmbed } from "discord.js";
import { ServerSettingsModel } from "../../database/models/ServerSettings/ServerSettings.model";

export default class ServerCommandsCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "servercommands",
            aliases: ["cmds", "server-commands"],
            group: "messages",
            memberName: "commands",
            description: "View this guilds custom commands.",
            guildOnly: true,
        });
    }

    async run(message: CommandoMessage): Promise<Message> {
        const guildSettings = await ServerSettingsModel.findOneOrCreate({ guildId: message.guild.id });
        const cmdMap = await guildSettings.getCommands();

        const commands = Array.from(cmdMap.keys());

        const output = new MessageEmbed()
            .setTitle("Custom Commands")
            .setColor("#4287f5")
            .addField("This servers custom commands:", commands.join("\n") + "⠀");

        const thumb = message.guild.iconURL();
        if (thumb) {
            output.setThumbnail(thumb);
        }

        return message.channel.send(output);
    }
}
