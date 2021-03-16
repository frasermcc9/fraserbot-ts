import { BotEvent } from "../Events.interface";
import { Bot } from "../../Bot";
import { Message } from "discord.js";

export default class DadReply implements BotEvent {
    private client: Bot = Bot.Get;

    start(): void {
        this.client.on("message", this.handler);
    }

    private handler = async (message: Message) => {
        if (message.content === ":)") {
            return message.channel.send(":)");
        }
    };
}
