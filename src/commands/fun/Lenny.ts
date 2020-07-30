import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";

export default class LennyCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "lenny",
            group: "fun",
            memberName: "lenny",
            description: "Replies with a lenny face",
        });
    }

    async run(message: CommandoMessage, args: any): Promise<Message> {
        if (message.deletable) {
            message.delete();
        }
        return message.channel.send("( ͡° ͜ʖ ͡°)");
    }
}
