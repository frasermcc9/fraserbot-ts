import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, MessageEmbed } from "discord.js";
import { get } from "http";

export default class UrbanCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "urban",
            aliases: ["urbandictionary"],
            group: "fun",
            memberName: "urban",
            description:
                "Gets the definition of a given word from urban dictionary. If no word is given, gets a random definition.",
            args: [
                {
                    key: "search",
                    prompt: "What word would you like to look up?",
                    type: "string",
                    default: "",
                },
                {
                    key: "page",
                    prompt: "Which entry would you like to see?",
                    type: "integer",
                    default: 1,
                },
            ],
        });
    }

    async run(message: CommandoMessage, { page, search }: CommandArguments): Promise<Message | Message[]> {
        let url: string;
        let title: string;

        if (search == "") {
            url = "http://api.urbandictionary.com/v0/random";
            title = `Random Urban Dictionary Definition: `;
        } else {
            url = "http://api.urbandictionary.com/v0/define?term=" + search;
            title = `Urban Dictionary Definition: `;
        }

        const data = await this.getData(url);

        page -= 1;
        if (page >= data.list.length) {
            page = data.list.length - 1;
        }

        const entry = data.list[page];

        const output = new MessageEmbed()
            .setTitle(`${title}${entry.word}`)
            .setDescription(entry.definition)
            .addField("Example", entry.example)
            .addField("👍", entry.thumbs_up, true)
            .addField("👎", entry.thumbs_down, true)
            .setFooter(`Author: ${entry.author}`)
            .setColor("#7a00cc")
            .setThumbnail(
                "https://slack-files2.s3-us-west-2.amazonaws.com/avatars/2018-01-11/297387706245_85899a44216ce1604c93_512.jpg"
            )
            .setURL(entry.permalink);

        return message.say(output);
    }

    private async getData(url: string): Promise<DictionaryResult> {
        let data = "";
        return new Promise((resolve, reject) => {
            get(url, (stream) => {
                stream
                    .on("data", (chunk) => (data += chunk))
                    .on("end", () => resolve(JSON.parse(data)))
                    .on("error", () => reject("Error getting data from urban dictionary,"));
            });
        });
    }
}

interface CommandArguments {
    search: string;
    page: number;
}

interface DictionaryResult {
    list: {
        definition: string;
        permalink: string;
        thumbs_up: number;
        sound_urls: [];
        author: string;
        word: string;
        defid: number;
        current_vote: string;
        written_on: string;
        example: string;
        thumbs_down: string;
    }[];
}
