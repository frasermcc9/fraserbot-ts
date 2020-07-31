import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";
import { ServerSettingsModel } from "../../database/models/ServerSettings/ServerSettings.model";

export default class PrefixCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "prefix",
            group: "core",
            memberName: "prefix",
            description: "Show or set this server's prefix",
            userPermissions: ["ADMINISTRATOR"],
            args: [
                {
                    key: "pref",
                    prompt: "What would you like to set the command prefix to?",
                    type: "string",
                    default: "",
                    validate: (s: string) => s.length < 5,
                },
            ],
        });
    }

    async run(message: CommandoMessage, { pref }: { pref: string }): Promise<Message> {
        const guildSettings = await ServerSettingsModel.findOneOrCreate({ guildId: message.guild.id });
        if (!pref) {
            return message.channel.send(
                `This server's command prefix is ${guildSettings.getPrefix() ?? this.client.commandPrefix}.`
            );
        } else {
            pref = pref.toLowerCase();
            guildSettings.setPrefix({ prefix: pref });
            return message.channel.send(`This server's command prefix is now ${pref}!`);
        }
    }
}
