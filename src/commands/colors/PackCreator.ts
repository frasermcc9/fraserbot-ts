import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";

export class CreatePackCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "createpack",
            group: "core",
            memberName: "createpack",
            description: "Setup guide for creating a colour-pack.",
        });
    }

    async run(message: CommandoMessage, args: any): Promise<Message> {
        return message.channel.send("Not implemented");
    }
}
