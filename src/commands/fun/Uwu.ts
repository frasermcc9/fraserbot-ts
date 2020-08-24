//generates a random number

import { CommandoMessage, CommandoClient } from "discord.js-commando";

const { Command } = require("discord.js-commando");

export default class UwuCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "uwu",
            aliases: ["uwutranslator"],
            memberName: "uwu",
            group: "core",
            description: "Translate something into UwU-ness",
            guildOnly: true,
            args: [
                {
                    key: "textToTranslate",
                    prompt: "What would you like me to translate?",
                    type: "string",
                    validate: (query: string) => query.length > 0 && query.length < 1900,
                },
            ],
        });
    }

    async run(msg: CommandoMessage, { textToTranslate }: { textToTranslate: string }) {
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
        msg.delete();
        return msg.say(result);
    }
}
