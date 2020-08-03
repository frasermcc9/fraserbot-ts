import { Channel, Message, TextChannel } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Bot } from "../../Bot";
import { ReactMessageModel } from "../../database/models/ReactMessage/ReactMessage.model";
import Log from "../../helpers/Log";

export default class RemoveReactionCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "removereaction",
            group: "roles",
            memberName: "removereaction",
            description: "Removes a role reaction.",
            userPermissions: ["ADMINISTRATOR"],
            guildOnly: true,
            args: [
                {
                    key: "channel",
                    prompt: "The channel the reaction message is in",
                    type: "channel",
                },
                {
                    key: "messageId",
                    prompt: "The message the reactions should be removed from",
                    type: "string",
                },
                {
                    key: "reaction",
                    prompt: "The emoji reaction",
                    type: "string",
                },
            ],
        });
    }

    async run(message: CommandoMessage, { channel, messageId, reaction }: ICommandArgs): Promise<Message> {
        //If a custom emoji is used, change it into correct form
        if (reaction.startsWith("<")) {
            reaction = reaction.match(/(\d+)/)![0];
        }
        //Get guild data from database
        const guildData = await ReactMessageModel.findOneOrCreate({ guildId: message.guild.id });

        //check if channel is right type, and cast to text channel if it is
        if (channel.type != "text") {
            Log.warn("React Role", "Incorrect voice channel type used when calling command.");
            return message.channel.send("Please use a text channel for this command.");
        }
        const guildChannel = channel as TextChannel;

        try {
            const rxnMessage = await guildChannel.messages.fetch(messageId);
            rxnMessage.reactions.resolve(reaction)?.remove();
            Bot.Get.destroyReactionListener(messageId, reaction);
        } catch (e) {
            Log.warn("React Role", `Failed to remove reaction from message ${messageId} with ${reaction}.`, e);
            return message.channel.send("This reaction could not be removed.");
        }

        await guildData.removeReactionListener({ messageId: messageId, reaction: reaction });

        return message.channel.send("Reaction role removed!");
    }
}

interface ICommandArgs {
    channel: Channel;
    messageId: string;
    reaction: string;
}
