import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message } from "discord.js";
import mexp from "math-expression-evaluator";

export default class CalcCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "calc",
            group: "core",
            memberName: "calc",
            aliases: ["math"],
            description: "Evaluate mathematical expressions",
            args: [
                {
                    key: "expression",
                    prompt: "What expression would you like to evaluate?",
                    type: "string",
                },
            ],
        });
    }

    async run(message: CommandoMessage, { expression }: { expression: string }): Promise<Message> {
        return message.channel.send(mexp.eval(expression));
    }
}
