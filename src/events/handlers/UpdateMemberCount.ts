import { BotEvent } from "../Events.interface";
import { Bot } from "../../Bot";
import Log from "../../helpers/Log";
import { GuildMember } from "discord.js";

export default class UpdateMemberCount implements BotEvent {
    private client: Bot = Bot.Get;

    start(): void {
        this.client.on("guildMemberAdd", this.updater);

        this.client.on("guildMemberRemove", this.updater);
    }

    private updater = (member: GuildMember) => {
        const size = member.guild.memberCount;
        const channel = member.guild.channels.cache.find((c) => c.id == "737587986031706162");
        if (channel == undefined) {
            Log.warn("UpdateMemberCount", "Channel could not be found.");
        } else {
            channel.setName(`Members ➤ ${size}`);
        }
    };
}
