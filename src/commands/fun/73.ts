import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";

export default class num73 extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "73",
            group: "fun",
            memberName: "73",
            description: "73",
        });
    }

    async run(message: CommandoMessage, args: any): Promise<Message> {
        if (message.deletable) {
            message.delete();
        }
        for(let i = 0; i< 72; i++){
            message.channel.send("73");
        }
        return message.channel.send("73");
    }
}
