import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, VoiceChannel, Channel } from "discord.js";
import { DataParser, DataWriter } from "../../data/DataParser";
import { DataDirectory } from "../../constants/DataDirectory";
import { ChannelDuplicatorSchema } from "../../data/ChannelDuplicator/ChannelDuplicatorSchema";

export default class ChannelDuplicatorCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "channelduplicator",
            aliases: ["channel-duplicator"],
            group: "moderation",
            memberName: "channelduplicator",
            description:
                "Setup a new voice channel for duplication (members who join will temporarily create a new voice channel for themselves).",
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
        let channels = DataParser<ChannelDuplicatorSchema>(
            DataDirectory + "\\ChannelDuplicator\\ChannelDuplicator.json"
        );
        if (channels[guild] == undefined) {
            channels[guild] = [vc.id];
        } else {
            channels[guild]?.push(vc.id);
        }
        await DataWriter(DataDirectory + "\\ChannelDuplicator\\ChannelDuplicator.json", JSON.stringify(channels));

        return message.channel.send(`Channel ${vc.name} has been set as a duplicating channel.`);
    }
}
