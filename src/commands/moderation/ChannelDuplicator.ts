import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, VoiceChannel, Channel } from "discord.js";
import { ChannelDuplicatorModel } from "../../database/models/ChannelDuplicator/ChannelDuplicator.model";

export default class ChannelDuplicatorCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "channelduplicator",
            aliases: ["channel-duplicator"],
            group: "moderation",
            memberName: "channelduplicator",
            description:
                "Setup a new voice channel for duplication (members who join will temporarily create a new voice channel for themselves).",
            userPermissions: ["ADMINISTRATOR"],
            args: [
                {
                    key: "channel",
                    prompt: "The voice channel to be set as a duplicating channel",
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

        const guildData = await ChannelDuplicatorModel.findOneOrCreate({ guildId: guild });
        if (!guildData.channelIds.includes(vc.id)) {
            guildData.addGuildChannel({ channelId: vc.id });
            return message.channel.send(`Channel ${vc.name} has been set as a duplicating channel.`);
        } else {
            guildData.removeGuildChannel({ channelId: vc.id });
            return message.channel.send(`Channel ${vc.name} has been removed as a duplicating channel.`);
        }
    }
}
