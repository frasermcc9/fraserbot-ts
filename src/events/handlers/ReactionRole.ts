import { BotEvent } from "../Events.interface";
import { Bot } from "../../Bot";
import Log from "../../helpers/Log";
import { VoiceState, ReactionCollector, TextChannel, MessageReaction, User, Role } from "discord.js";
import { ChannelDuplicatorModel } from "../../database/models/ChannelDuplicator/ChannelDuplicator.model";
import { ReactMessageModel } from "../../database/models/ReactMessage/ReactMessage.model";

export default class ReactionRole implements BotEvent {
    private client: Bot = Bot.Get;

    /**
     * Initiates listeners for all reaction roles.
     */
    async start(): Promise<void> {
        const guildData = await ReactMessageModel.find();
        //loops through all reactions in all guilds
        guildData.forEach((guild) => {
            const messages = guild.messages;
            messages.forEach(async (msg) => {
                //Get the guild object
                const rxnGuild = this.client.guilds.resolve(guild.guildId);
                if (!rxnGuild) {
                    return Log.error("Reaction Role Init", `Could not find guild ${guild.guildId}.`);
                }
                //Get the channel object to look in
                const rxnChannel = rxnGuild.channels.resolve(msg.channelId);
                if (!rxnChannel) {
                    return Log.error(
                        "Reaction Role Init",
                        `Could not find channel ${msg.channelId} in guild ${rxnGuild.name}.`
                    );
                }
                if (rxnChannel.type != "text") {
                    return Log.error(
                        "Reaction Role Init",
                        `Channel ${rxnChannel.name} in guild ${rxnGuild.name} is not a text channel.`
                    );
                }

                //Get the message object with the reactions on it
                const rxnMessage = await (rxnChannel as TextChannel).messages.fetch(msg.messageId).catch(async () => {
                    Log.warn(
                        "Reaction Role Init",
                        `Message ${msg.messageId} in channel ${rxnChannel.name} in guild ${rxnGuild.name} (${rxnGuild.id}) could not be found. Deleting it from database.`
                    );
                    const gd = guildData.find((d) => d == guild)!;
                    const idx = gd.messages.indexOf(msg);
                    gd.messages.splice(idx, 1);
                    gd.markModified("messages");
                    await gd.setLastUpdated();
                });
                if (!rxnMessage) {
                    return;
                }

                //Get the role object that should be assigned
                const rxnRole = await rxnGuild.roles.fetch(msg.roleId);
                if (!rxnRole) {
                    return Log.error(
                        "Reaction Role Init",
                        `Role ${msg.roleId} in guild ${rxnGuild.name} could not be found.`
                    );
                }

                let sepRole: Role | null;
                if (guild.separatorRole) sepRole = await rxnGuild.roles.fetch(guild.separatorRole);

                //Apply the filter to ignore emojis that are not the one of interest
                const filter = (r: MessageReaction, u: User) => {
                    return u.bot == false && (r.emoji.name == msg.reaction || r.emoji.id == msg.reaction);
                };

                //Add listeners
                const collector = new ReactionCollector(rxnMessage, filter, { dispose: true })
                    .on("collect", async (r: MessageReaction, u: User) => {
                        const member = await r.message.guild?.members.fetch(u.id);
                        member?.roles.add(rxnRole);
                        if (sepRole) member?.roles.add(sepRole);
                        Log.trace("React Role", `Added role ${rxnRole.name} to ${u.username}.`);
                    })
                    .on("remove", async (r: MessageReaction, u: User) => {
                        let member = await r.message.guild?.members.fetch(u.id);
                        member = await member?.roles.remove(rxnRole);
                        //remove the separator if it is now the highest colour of the user
                        if (sepRole) if (member?.roles.color == sepRole) await member?.roles.remove(sepRole);
                        Log.trace("React Role", `Removed role ${rxnRole.name} from ${u.username}.`);
                    });

                Bot.Get.storeReactionListener(collector, msg.reaction);

                Log.trace(
                    "Reaction Role Init",
                    `Successfully readied reaction role ${rxnRole.name} in guild ${rxnGuild.name}.`
                );
            });
        });
    }
}
