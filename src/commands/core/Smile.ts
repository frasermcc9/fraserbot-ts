import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";

export default class SmileCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "smile",
            group: "core",
            memberName: "smile",
            description: `Says :)`,
        });
    }

    async run(message: CommandoMessage, args: any): Promise<Message> {
        return message.channel.send(`:)`);
    }
}
