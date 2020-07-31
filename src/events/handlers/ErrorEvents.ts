import { BotEvent } from "../Events.interface";
import { Bot } from "../../Bot";
import Log from "../../helpers/Log";
import { GuildMember } from "discord.js";
import { ServerSettingsModel } from "../../database/models/ServerSettings/ServerSettings.model";

export default class DebugOutput implements BotEvent {
    private client: Bot = Bot.Get;

    start(): void {
        this.client.on("debug", (info: string) => Log.debug("Bot", info));
        this.client.on("warn", (info: string) => Log.warn("Bot", info));
        this.client.on("error", (info: Error) => Log.error("Bot", "Error occurred", info));

        this.client.on("commandError", (command, error, message) => {
            Log.error("Command Error", `Error with ${command.name}. Message sent: ${message.content}.`, error);
        });
    }
}
