import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, GuildMember, MessageEmbed } from "discord.js";
import { ServerSettingsModel } from "../../database/models/Server/ServerSettings.model";
import { Bot } from "../../Bot";

export default class AddCommandCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "addcommand",
            aliases: ["addcmd", "add-server-commands"],
            group: "messages",
            memberName: "addcommand",
            description: "Add a custom command for this guild.",
            guildOnly: true,
            userPermissions: ["MANAGE_CHANNELS"],
            args: [
                {
                    key: "command",
                    prompt: "What is the name of the command you'd like to add?",
                    type: "string",
                    validate: (s: string) => s.length < 64,
                },
                {
                    key: "response",
                    prompt: "What should the bot reply with when this command is called?",
                    type: "string",
                    validate: (s: string) => s.length < 1000,
                },
            ],
        });
    }

    async run(
        message: CommandoMessage,
        { command, response }: { command: string; response: string }
    ): Promise<Message> {
        command = command.toLowerCase();
        const guildSettings = await ServerSettingsModel.findOneOrCreate({ guildId: message.guild.id });
        await guildSettings.addCommand({ name: command, response: response });
        Bot.Get.refreshCachePoint(guildSettings);

        const gId = message.guild.id;
        const fn = (cmdMsg: Message) => {
            const m = cmdMsg as CommandoMessage;
            if (m.guild == null) return;
            if (m.guild.id != gId) return;
            if (!m.argString) return;
            if (m.cleanContent.toLowerCase() == `${m.argString}${command.toLowerCase()}`) {
                return m.channel.send(response);
            }
        };
        this.client.on("message", fn);
        Bot.Get.storeCommandListener(fn, gId, command);

        return message.channel.send(`Command with name **${command}** added!`);
    }
}
