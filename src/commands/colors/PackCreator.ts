import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, MessageEmbed, MessageCollector, Role, TextChannel } from "discord.js";
import { findBestMatch } from "string-similarity";
import { executionAsyncResource } from "async_hooks";

/**
 * Creators 'packs' of colours, an embed containing one or more roles (intended
 * as colours) that users can select from.
 */
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

    /**
     * Creates a message collector with the given timeout
     * @param message the original message
     * @param timeout time in seconds before turning off collector
     */
    private createCollector(message: CommandoMessage, timeout: number = 30) {
        return new MessageCollector(message.channel, (m) => m.author.id == message.author.id, {
            time: timeout * 1000,
        });
    }

    /**
     * Command entry point. Handles overall command flow.
     * @param message the original message
     * @param args never
     */
    async run(message: CommandoMessage, args: never): Promise<Message> {
        let finalMsg;
        try {
            await this.userConfirm(message);

            const roles = await this.getRolesToAdd(message);
            const msgInfo = await this.getMessageInfo(message);
            await this.execute(message, roles, msgInfo);
            finalMsg = message.channel.send("Colour Pack Created!");
        } catch (e) {
            finalMsg = message.channel.send(e);
        }

        return finalMsg;
    }

    /**
     * Initial input handler for confirming the user wishes to make a pack
     * @param message the invoking message
     */
    private async userConfirm(message: CommandoMessage): Promise<void> {
        const replyMsg = await message.channel.send(this.userConfirmEmbed());
        return new Promise((res, rej) => {
            this.createCollector(message, 30)
                .once("collect", async (data) => {
                    replyMsg.delete().catch(() => {});
                    const m = data as Message;
                    const candidate = findBestMatch(m.content, this.options).bestMatch.target;
                    if (candidate == "cancel") {
                        rej("Cancelled!");
                    } else {
                        res();
                    }
                })
                .on("end", () => rej("Ran out of time."));
        });
    }
    /**
     * Embed for userConfirm() method
     */
    private userConfirmEmbed() {
        return new MessageEmbed()
            .setTitle("Colour Pack Creator")
            .setDescription("This guide will walk you through creating a colour pack!")
            .setFooter("Type 'continue' to carry on, or cancel at any time by saying 'cancel'.")
            .setColor("#03c6fc");
    }

    /**
     * Gets roles to add from the command invoker.
     * @param message the original message
     */
    private async getRolesToAdd(message: CommandoMessage): Promise<RoleDataArgs[]> {
        const roleData: { name: string; color: string }[] = [];
        const replyMsg = await message.channel.send(this.rolesToAddEmbed());
        return new Promise((res, rej) => {
            const MC = this.createCollector(message, 180)
                .on("collect", async (data) => {
                    const m = data as Message;

                    if (/^.+\|#.+$/.test(m.content)) {
                        //if message passes regex, add it to the array storing roles
                        const input = m.content.split("|");
                        roleData.push({ name: input[0], color: input[1] });
                    } else {
                        //otherwise check if it is cancel/continue
                        MC.removeAllListeners();
                        replyMsg.delete().catch(() => {});
                        const candidate = findBestMatch(m.content, this.options).bestMatch.target;
                        if (candidate == "cancel") {
                            rej("Cancelled!");
                        } else {
                            res(roleData);
                        }
                    }
                })
                .on("end", () => rej("Ran out of time."));
        });

        //initiate collector
    }
    /**
     * Embed for getRolesToAdd()
     */
    private rolesToAddEmbed(): MessageEmbed {
        return new MessageEmbed()
            .setTitle("Create a new Colour")
            .addField(
                "Instructions",
                "To create the settings of the colour, reply with the following syntax:\n [Name]|[HexColour]"
            )
            .addField("Example", "My Cool Role|#03c6fc")
            .setFooter("Type 'continue' to carry on, or cancel at any time by saying 'cancel'.")
            .setColor("#03c6fc");
    }

    /**
     * Gets info from the user about what should be inside the message. Called
     * @param message
     * @param roleData
     */
    private async getMessageInfo(message: CommandoMessage): Promise<GetMessageInfoArgs> {
        const prompts = [
            ["Please reply with the title of this pack", "My Cool Pack"],
            ["Please describe this pack", "This is my cool pack"],
            ["Please provide a sidebar colour for this pack", "#ffffff"],
            ["Please provide an image URL for this pack", "MyImage.jpg"],
            ["Please provide the channel ID you would like to output to", "12379812371237"],
        ];
        const msgData: string[] = [];
        const replyMsg = await message.channel.send(
            this.getMessageInfoEmbed(prompts[msgData.length][0], prompts[msgData.length][1])
        );

        return new Promise((res, rej) => {
            const MC = this.createCollector(message, 120)
                .on("collect", async (data) => {
                    const m = data as Message;
                    if (m.content == "cancel") {
                        MC.removeAllListeners();
                        rej("Cancelled");
                    }
                    if (m.deletable) m.delete();
                    msgData.push(m.content);

                    if (msgData.length == prompts.length) {
                        replyMsg.delete();
                        MC.removeAllListeners();
                        res({
                            title: msgData[0],
                            description: msgData[1],
                            color: msgData[2],
                            uri: msgData[3],
                            channel: msgData[4],
                        });
                    } else {
                        replyMsg.edit(this.getMessageInfoEmbed(prompts[msgData.length][0], prompts[msgData.length][1]));
                    }
                })
                .on("end", () => rej("Ran out of time."));
        });
    }
    /**
     * Embed generator for getMessageInfo() method
     * @param title the instruction to follow
     * @param eg an example entry
     */
    private getMessageInfoEmbed(title: string, eg: string): MessageEmbed {
        return new MessageEmbed()
            .setTitle("Almost Finished!")
            .setDescription(title)
            .addField("Example", eg)
            .setFooter("Cancel at any time by saying 'cancel'.")
            .setColor("#03c6fc");
    }

    /**
     * final stage that creates the roles and outputs the messages
     * @param message the original invoking message
     * @param roleData the role data for the roles to be created
     * @param msgData the data for the output message
     */
    private async execute(message: CommandoMessage, roleData: RoleDataArgs[], msgData: GetMessageInfoArgs) {
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
                const outputChannel = message.guild.channels.cache.find((c) => c.id == msgData.channel);
                if (outputChannel == undefined || outputChannel.type != "text") {
                    Promise.reject("Invalid channel ID provided.");
                } else {
                    (outputChannel as TextChannel).send(output);
                }
            }
        });
    }
}

interface RoleDataArgs {
    name: string;
    color: string;
}
interface GetMessageInfoArgs {
    title: string;
    description: string;
    color: string;
    uri: string;
    channel: string;
}
