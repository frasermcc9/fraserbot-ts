import { BotEvent } from "../Events.interface";
import { Bot } from "../../Bot";
import Log from "../../helpers/Log";
import { GuildMember } from "discord.js";
import { ServerSettingsModel } from "../../database/models/ServerSettings/ServerSettings.model";

export default class UpdateMemberCount implements BotEvent {
    private client: Bot = Bot.Get;

    start(): void {
        this.client.on("guildMemberAdd", this.updater);

        this.client.on("guildMemberRemove", this.updater);
    }

    private updater = async (member: GuildMember) => {
        const size = member.guild.memberCount;

        const channelData = await ServerSettingsModel.findOneOrCreate({ guildId: member.guild.id });
        const channelId = channelData.getMemberCountChannel();
        const channel = member.guild.channels.cache.find((c) => c.id == channelId);
        
        if (channel == undefined) {
            Log.trace("UpdateMemberCount", `Server ${member.guild.name} has no member count channel to update.`);
        } else {
            Log.trace("UpdateMemberCount", `Updating member counter for ${member.guild.name}.`);
            channel.setName(`Members ➤ ${size}`);
        }
    };
}
