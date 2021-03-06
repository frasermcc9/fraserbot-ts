import { BotEvent } from "../Events.interface";
import { Bot } from "../../Bot";
import { Message } from "discord.js";

export default class DadReply implements BotEvent {
    private client: Bot = Bot.Get;

    start(): void {
        this.client.on("message", this.handler);
    }

    private handler = async (message: Message) => {
        if (!message.guild || message.author.bot) {
            return;
        }
        if (this.client.GuildSettingsCache.get(message.guild.id)?.dadBot != true) {
            return;
        }
        if (Math.random() < 0.8) return;
        const content = message.content.toLowerCase();
        if (content.startsWith("im ")) {
            const string = message.content.slice(3);
            return message.channel.send(`Hi ${string}, I'm ${process.env.BOTNAME}!`);
        } else if (content.startsWith("i'm ")) {
            const string = message.content.slice(4);
            return message.channel.send(`Hi ${string}, I'm ${process.env.BOTNAME}!`);
        } else if (content.startsWith("i`m ")) {
            const string = message.content.slice(4);
            return message.channel.send(`Hi ${string}, I'm ${process.env.BOTNAME}!`);
        } else if (content.startsWith("i am ")) {
            const string = message.content.slice(5);
            return message.channel.send(`Hi ${string}, I'm ${process.env.BOTNAME}!`);
        }
    };
}
