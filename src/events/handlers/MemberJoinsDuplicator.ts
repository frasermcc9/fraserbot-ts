import { BotEvent } from "../Events.interface";
import { Bot } from "../../Bot";
import Log from "../../helpers/Log";
import {  VoiceState } from "discord.js";
import { ChannelDuplicatorModel } from "../../database/models/ChannelDuplicator/ChannelDuplicator.model";

export default class UpdateMemberCount implements BotEvent {
    private client: Bot = Bot.Get;

    start(): void {
        this.client.on("voiceStateUpdate", this.updater);
    }

    private updater = async (oldState: VoiceState | undefined, newState: VoiceState) => {
        const guildId = oldState?.guild.id ?? newState.guild.id;
        const enabledChannels = await ChannelDuplicatorModel.getGuildChannels({ guildId: guildId });
        const channelId = newState.channelID;

        if (channelId == undefined) {
            //the member left a channel
            //delete it if its an enabled channel and its empty
        } else if (enabledChannels.includes(channelId)) {
            //the member joined an enabled channel
        }
    };
}
