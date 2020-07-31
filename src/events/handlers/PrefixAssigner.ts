import { BotEvent } from "../Events.interface";
import { Bot } from "../../Bot";
import Log from "../../helpers/Log";
import { GuildMember } from "discord.js";
import { ServerSettingsModel } from "../../database/models/ServerSettings/ServerSettings.model";
import { CommandoGuild } from "discord.js-commando";

export default class UpdateMemberCount implements BotEvent {
    private client: Bot = Bot.Get;

    start(): void {
        this.client.guilds.cache.forEach(async (guild) => {
            const settings = await ServerSettingsModel.findOneOrCreate({ guildId: guild.id });
            const prefix = settings.getPrefix();
            Object.defineProperty(guild, "commandPrefix", {
                value: prefix ?? this.client.commandPrefix,
                writable: true,
            });
        });
    }
}
