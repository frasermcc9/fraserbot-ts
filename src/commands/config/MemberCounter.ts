import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, VoiceChannel, Channel } from "discord.js";
import { ServerSettingsModel } from "../../database/models/ServerSettings/ServerSettings.model";

export default class MemberCounterCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "membercounter",
            aliases: ["member-counter"],
            group: "config",
            memberName: "membercounter",
            description: "Set up a channel to count member changes.",
            userPermissions: ["ADMINISTRATOR"],
            args: [
                {
                    key: "channel",
                    prompt: "The voice channel to be set as the member counter",
                    type: "channel",
                },
            ],
        });
    }

    async run(message: CommandoMessage, { channel }: { channel: Channel }): Promise<Message> {
        if (!(channel.type == "voice")) {
            return message.channel.send("The chosen chanel must be a voice channel.");
        }
        const vc = channel as VoiceChannel;
        const guild = message.guild.id;

        const guildData = await ServerSettingsModel.findOneOrCreate({ guildId: guild });
        guildData.setMemberCountChannel({ channelId: vc.id });
        return message.channel.send(`${vc.name} has been set as the member count channel.`);
    }
}
