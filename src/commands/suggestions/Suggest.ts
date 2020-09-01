import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, GuildChannel, TextChannel, MessageEmbed } from "discord.js";
import { ServerSettingsModel } from "../../database/models/Server/ServerSettings.model";
import { count } from "console";

export default class SuggestionChannelCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "suggest",
            group: "suggestions",
            memberName: "suggest",
            description: "Create an anonymous suggestion!",
            guildOnly: true,
            args: [
                {
                    key: "suggestion",
                    prompt: "Please write your suggestion.",
                    type: "string",
                    validate: (m: string) => m.length < 1000,
                    error: "Please make sure your suggestion is less than 1000 characters long.",
                },
            ],
        });
    }

    async run(message: CommandoMessage, { suggestion }: { suggestion: string }): Promise<Message> {
        if (message.deletable) {
            await message.delete();
        }
        const guildSettings = await ServerSettingsModel.findOneOrCreate({ guildId: message.guild.id });
        const channel = guildSettings.getSuggestionChannel();
        if (channel == undefined) {
            return message.channel.send(
                "This server does not have a suggestion channel. If you would like one, ask an administrator to create one!"
            );
        }
        const channelObj = message.guild.channels.resolve(channel) as TextChannel;
        if (!channelObj) {
            return message.channel.send(
                "This servers suggestion channel appears to have been deleted. Please ask an administrator to reset it!"
            );
        }
        const counter = await guildSettings.incrementSuggestions();
        const output = new MessageEmbed()
            .setAuthor(
                "Anonymous",
                "https://cdn.discordapp.com/attachments/737561730967928853/738955669562065006/question-mark-emoji-by-twitter.png"
            )
            .setTitle(`Suggestion #${counter}`)
            .setDescription(suggestion)
            .setColor("#08a4ff");
        const msg = await channelObj.send(output);
        await msg.react("⬆️");
        await msg.react("⬇️");
        return msg;
    }
}
