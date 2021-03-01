import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, MessageAttachment } from "discord.js";

import fetch from "node-fetch";

export default class RedditCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "reddit",
            group: "fun",
            memberName: "reddit",
            description: "Gets a random reddit image",
            args: [
                {
                    key: "subreddit",
                    prompt: "What subreddit should the image be from",
                    type: "string",
                },
            ],
        });
    }

    async run(message: CommandoMessage, { subreddit }: { subreddit: string }): Promise<Message> {
        const url = "http://www.reddit.com/r/" + subreddit + "/random.json?limit=1";

        try {
            const res = await fetch(url);
            const json = await res.json();
            const img = json[0]?.data?.children[0]?.data?.url;
            if (img) {
                return message.channel.send("|| " + img + " ||");
            } else {
                throw new Error();
            }
        } catch {
            return message.channel.send("Error while getting image");
        }
    }
}
