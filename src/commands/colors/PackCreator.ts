import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, MessageEmbed, MessageCollector, Role } from "discord.js";
import { findBestMatch } from "string-similarity";
import { executionAsyncResource } from "async_hooks";

export default class CreatePackCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "createpack",
            group: "colors",
            memberName: "createpack",
            description: "Setup guide for creating a colour-pack.",
        });
    }

    private readonly options = ["cancel", "continue"];

    async run(message: CommandoMessage, args: any): Promise<Message> {
        const MC0 = new MessageCollector(message.channel, (m) => m.author == message.author, {
            time: 30 * 1000,
        })
            .once("collect", async (data) => {
                MC0.stop();
                const m = data as Message;
                const candidate = findBestMatch(m.content, this.options).bestMatch.target;
                if (candidate == "cancel") {
                    return msg0.channel.send("Cancelled!");
                } else {
                    this.recursiveHelper(message, []);
                }
            })
            .once("end", () => msg0.delete());
        const msg0 = await message.channel.send(
            new MessageEmbed()
                .setTitle("Colour Pack Creator")
                .setDescription("This guide will walk you through creating a colour pack!")
                .setFooter("Type 'continue' to carry on, or cancel at any time by saying 'cancel'.")
                .setColor("#03c6fc")
        );
        return msg0;
    }

    private async recursiveHelper(message: CommandoMessage, roleData: { name: string; color: string }[]) {
        const msg0 = await message.channel.send(
            new MessageEmbed()
                .setTitle("Create a new Colour")
                .addField(
                    "Instructions",
                    "To create the settings of the colour, reply with the following syntax:\n [Name]|[HexColour]"
                )
                .addField("Example", "My Cool Role|#03c6fc")
                .setFooter("Type 'continue' to carry on, or cancel at any time by saying 'cancel'.")
                .setColor("#03c6fc")
        );
        const MC0 = new MessageCollector(message.channel, (m) => m.author == message.author, {
            time: 30 * 1000,
        })
            .once("collect", async (data) => {
                MC0.stop();
                const m = data as Message;
                if (/^.+\|#.+$/.test(m.content)) {
                    const input = m.content.split("|");
                    roleData.push({ name: input[0], color: input[1] });
                    this.recursiveHelper(message, roleData);
                } else {
                    const candidate = findBestMatch(m.content, this.options).bestMatch.target;
                    if (candidate == "cancel") {
                        return msg0.channel.send("Cancelled!");
                    } else {
                        this.finishHelper(message, roleData);
                    }
                }
            })
            .once("end", () => msg0.delete());
    }

    private async finishHelper(message: CommandoMessage, roleData: { name: string; color: string }[]) {
        const msgData: string[] = [];
        const msg0 = await message.channel.send(
            new MessageEmbed()
                .setTitle("Almost Finished!")
                .setDescription("Here we will set up the message")
                .addField(
                    "Instructions",
                    "Reply with the information in the following order in separate messages:\nPack Name\nPack Description\nSidebar Hex Colour\nMessage Image/Gif"
                )
                .addField("Example", "Cool Pack\nMy first pack\n#ffffff\nsomeimage.jpeg")
                .setFooter("Cancel at any time by saying 'cancel'.")
                .setColor("#03c6fc")
        );
        const MC0 = new MessageCollector(message.channel, (m) => m.author == message.author, {
            time: 120 * 1000,
        })
            .on("collect", async (data) => {
                const m = data as Message;
                if (m.content == "cancel") {
                    return message.channel.send("Cancelled!");
                }
                msgData.push(m.content);
                if (msgData.length == 4) {
                    msg0.delete();
                    MC0.stop();
                    this.execute(message, roleData, {
                        title: msgData[0],
                        description: msgData[1],
                        color: msgData[2],
                        uri: msgData[3],
                    });
                }
            })

            .once("end", () => msg0.delete());
    }

    private async execute(
        message: CommandoMessage,
        roleData: { name: string; color: string }[],
        msgData: { title: string; description: string; color: string; uri: string }
    ) {
        const output = new MessageEmbed()
            .setTitle(msgData.title)
            .setDescription(msgData.description)
            .setImage(msgData.uri)
            .setColor(msgData.color);

        const addedRoles: Role[] = [];

        roleData.forEach(async (role, idx) => {
            addedRoles.push(
                await message.guild.roles.create({ data: { name: role.name, color: role.color, position: 0 } })
            );
            if (addedRoles.length == roleData.length) {
                output.addField("Roles", addedRoles.join("\n"));
                return message.say(output);
            }
        });
    }
}
