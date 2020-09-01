import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, GuildChannel, TextChannel } from "discord.js";
import { ServerSettingsModel } from "../../database/models/Server/ServerSettings.model";

export default class SuggestionChannelCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "suggestionchannel",
            group: "suggestions",
            memberName: "suggestionchannel",
            description: "Set-up a suggestion channel where user suggestions will be posted.",
            userPermissions: ["ADMINISTRATOR"],
            guildOnly: true,
            args: [
                {
                    key: "suggestionChannel",
                    prompt: "What channel should the suggestion channel be?",
                    type: "text-channel",
                },
            ],
        });
    }

    async run(message: CommandoMessage, { suggestionChannel }: { suggestionChannel: GuildChannel }): Promise<Message> {
        if (suggestionChannel.type != "text") {
            return message.channel.send("Cannot set the suggestion channel to a non-text channel.");
        }
        const guildSettings = await ServerSettingsModel.findOneOrCreate({ guildId: message.guild.id });
        await guildSettings.setSuggestionChannel({ channelId: suggestionChannel.id });
        return message.channel.send(`${suggestionChannel} has been set as this servers suggestion channel!`);
    }
}
