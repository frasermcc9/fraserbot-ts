import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import {
    Message,
    Channel,
    Role,
    TextChannel,
    ReactionCollector,
    ReactionEmoji,
    User,
    MessageReaction,
} from "discord.js";
import { ReactMessageModel } from "../../database/models/ReactMessage/ReactMessage.model";
import Log from "../../helpers/Log";

export default class ReactRoleCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "reactrole",
            group: "colors",
            memberName: "reactrole",
            description: "Gives users a role when they react.",
            args: [
                {
                    key: "channel",
                    prompt: "The channel the reaction message is in",
                    type: "channel",
                },
                {
                    key: "messageId",
                    prompt: "The message the reactions should be added to",
                    type: "string",
                },
                {
                    key: "reaction",
                    prompt: "The emoji reaction",
                    type: "string",
                },
                {
                    key: "role",
                    prompt: "The role that should be added to people when they react",
                    type: "role",
                },
            ],
        });
    }

    async run(message: CommandoMessage, { channel, messageId, reaction, role }: ICommandArgs): Promise<Message> {
        if (reaction.startsWith("<")) {
            reaction = reaction.match(/(\d+)/)![0];
        }
        const guildData = await ReactMessageModel.findOneOrCreate({ guildId: message.guild.id });
        if (channel.type != "text") {
            Log.warn("React Role", "Incorrect voice channel type used when calling command.");
            return message.channel.send("Please use a text channel for this command.");
        }

        const guildChannel = message.guild.channels.resolve(channel.id) as null | TextChannel;
        if (guildChannel == null) {
            Log.warn("React Role", `Requested channel ${channel.id} was not found`);
            return message.channel.send("This channel was not found.");
        }

        try {
            const rxnMessage = await guildChannel.messages.fetch(messageId);
            await rxnMessage.react(reaction);

            let sepRole: Role | null;
            if (guildData.separatorRole) sepRole = await message.guild.roles.fetch(guildData.separatorRole);

            const filter = (r: MessageReaction, u: User) => {
                return u.bot == false && (r.emoji.name == reaction || r.emoji.id == reaction);
            };

            new ReactionCollector(rxnMessage, filter, { dispose: true })
                .on("collect", async (r: MessageReaction, u: User) => {
                    const member = await r.message.guild?.members.fetch(u.id);
                    member?.roles.add(role);
                    if (sepRole) member?.roles.add(sepRole);
                    Log.trace("React Role", `Added role ${role.name} to ${u.username}.`);
                })
                .on("remove", async (r: MessageReaction, u: User) => {
                    let member = await r.message.guild?.members.fetch(u.id);
                    member = await member?.roles.remove(role);
                    //remove the separator if it is now the highest colour of the user
                    if (sepRole) if (member?.roles.color == sepRole) await member?.roles.remove(sepRole);
                    Log.trace("React Role", `Removed role ${role.name} from ${u.username}.`);
                });
        } catch (e) {
            Log.warn("React Role", `Failed to react to message ${messageId} with ${reaction}.`, e);
            return message.channel.send("This reaction could not be added.");
        }

        guildData.addReactionListener({
            channelId: channel.id,
            messageId: messageId,
            reaction: reaction,
            roleId: role.id,
        });

        return message.channel.send("Reaction role added!");
    }
}

interface ICommandArgs {
    channel: Channel;
    messageId: string;
    reaction: string;
    role: Role;
}
