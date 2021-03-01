import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";

export default class HiCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "hi",
            group: "core",
            memberName: "hi",
            description: `Says hi!`,
        });
    }

    async run(message: CommandoMessage, args: any): Promise<Message> {
        return message.channel.send("Hi!");
    }
}
