import { BotEvent } from "../Events.interface";
import { Bot } from "../../Bot";
import { Message } from "discord.js";

export default class DadReply implements BotEvent {
    private client: Bot = Bot.Get;

    start(): void {
        this.client.on("message", this.handler);
    }

    private handler = async (message: Message) => {
        if (!(message.guild?.id == "372349290397433867")) return;
        if (!(message.author.id == "656962312565030963")) return;
        const content = message.content;
        if (content.length > 4) {
            if (message.deletable) message.delete();
            const reply = this.translate(content);
            message.channel.send(reply);
        }
    };

    private translate(textToTranslate: string) {
        var input = textToTranslate;
        var i;
        var result = "";
        for (i = 0; i < input.length; i++) {
            var currentChar = input[i];
            var previousChar = "";
            if (i > 0) {
                previousChar = input[i - 1];
            }
            switch (currentChar) {
                case "L":
                case "R":
                    result += "W";
                    break;
                case "l":
                case "r":
                    result += "w";
                    break;
                case "o":
                case "O":
                    switch (previousChar) {
                        case "n":
                        case "N":
                        case "m":
                        case "M":
                            result += "yo";
                            break;
                        default:
                            result += currentChar;
                    }
                    break;
                default:
                    result += currentChar;
            }
        }
        return result;
    }
}
