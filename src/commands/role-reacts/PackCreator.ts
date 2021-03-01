import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import {
    Message,
    MessageEmbed,
    MessageCollector,
    Role,
    TextChannel,
    MessageReaction,
    User,
    ReactionCollector,
    DMChannel,
} from "discord.js";
import { findBestMatch } from "string-similarity";
import Log from "../../helpers/Log";
import { ReactMessageModel } from "../../database/models/ReactMessage/ReactMessage.model";
import { Bot } from "../../Bot";

/**
 * Creators 'packs' of colours, an embed containing one or more roles (intended
 * as colours) that users can select from.
 */
export default class CreatePackCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "createpack",
            group: "roles",
            memberName: "createpack",
            description: "Setup guide for creating a colour-pack.",
            userPermissions: ["ADMINISTRATOR"],
            guildOnly: true,
        });
    }

    private readonly options = ["cancel", "continue"];

    /**
     * Creates a message collector with the given timeout
     * @param message the original message
     * @param timeout time in seconds before turning off collector
     */
    private createCollector(message: CommandoMessage, timeout: number = 30) {
        return new MessageCollector(
            message.channel as TextChannel | DMChannel,
            (m) => m.author.id == message.author.id,
            {
                time: timeout * 1000,
            }
        );
    }

    /**
     * initial command entry point
     * @param message the calling message
     * @param param1 input args
     */
    async run(message: CommandoMessage): Promise<Message> {
        let finalMsg;
        try {
            const auto = await this.userConfirm(message);

            const roles = await this.getRolesToAdd(message);
            const msgInfo = await this.getMessageInfo(message);
            const reactMsg = await this.execute(message, roles, msgInfo);
            if (auto) await this.executeReactions(reactMsg.msg, reactMsg.roles);
            const extraInfo =
                roles.length > 10
                    ? "Auto reactions need less than 10 roles added. Manual role reactions will be needed."
                    : "";
            finalMsg = message.channel.send("Colour Pack Created! " + extraInfo);
        } catch (e) {
            finalMsg = message.channel.send(e);
        }

        return finalMsg;
    }

    /**
     * Initial input handler for confirming the user wishes to make a pack
     * @param message the invoking message
     */
    private async userConfirm(message: CommandoMessage): Promise<boolean> {
        const replyMsg = await message.channel.send(this.userConfirmEmbed());
        return new Promise((res, rej) => {
            this.createCollector(message, 30)
                .once("collect", async (data) => {
                    replyMsg.delete().catch(() => {});
                    const m = data as Message;
                    const options = ["cancel", "yes", "no"];
                    const candidate = findBestMatch(m.content, options).bestMatch.target;
                    if (candidate == "cancel") {
                        rej("Cancelled!");
                    } else {
                        let returnValue: boolean;
                        if (candidate == "yes") returnValue = true;
                        else returnValue = false;
                        res(returnValue);
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
            .addField(
                "First Step",
                "Would you like me to automatically add reactions and link them to the created roles? (yes/no)"
            )
            .setFooter("Cancel at any time by saying 'cancel'.")
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
            const MC = this.createCollector(message, 300)
                .on("collect", async (data) => {
                    const m = data as Message;

                    if (/^.+\#.+$/.test(m.content)) {
                        //if message passes regex, add it to the array storing roles
                        const input = m.content.split("#");
                        roleData.push({ name: input[0], color: "#" + input[1] });
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
                "To create the settings of the colour, reply with the following syntax:\n [Name]#[HexColour]"
            )
            .addField("Example", "My Cool Role#03c6fc")
            .addField("Next Step", "Simply keep replying with roles until you are done. Then type 'continue'.")
            .setFooter("Type 'continue' to carry on, or cancel at any time by saying 'cancel'.")
            .setColor("#03c6fc");
    }

    /**
     * Gets info from the user about what should be inside the message. Called
     * @param message
     * @param roleData
     */
    private async getMessageInfo(message: CommandoMessage): Promise<MsgInfoArgs> {
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
            const MC = this.createCollector(message, 180)
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
    private async execute(
        message: CommandoMessage,
        roleData: RoleDataArgs[],
        msgData: MsgInfoArgs
    ): Promise<{ msg: Message; roles: Role[] }> {
        const output = new MessageEmbed()
            .setTitle(msgData.title)
            .setDescription(msgData.description)
            .setColor(msgData.color);
        if (msgData.uri.length > 3) {
            output.setImage(msgData.uri);
        }

        const addedRoles: Role[] = [];

        return new Promise((res, rej) => {
            roleData.forEach(async (role, idx) => {
                addedRoles.push(
                    await message.guild.roles.create({ data: { name: role.name, color: role.color, position: 0 } })
                );
                if (addedRoles.length == roleData.length) {
                    output.addField("Roles", addedRoles.join("\n"));
                    const outputChannel = message.guild.channels.cache.find((c) => c.id == msgData.channel);
                    if (outputChannel == undefined || outputChannel.type != "text") {
                        rej("Invalid channel ID provided.");
                    } else {
                        const msg = await (outputChannel as TextChannel).send(output);
                        res({ msg: msg, roles: addedRoles });
                    }
                }
            });
        });
    }

    /**
     * Reacts to the message automatically
     * @param rMsg the message to react to (the one created by this command)
     * @param roles the roles that are in this pack
     */
    private async executeReactions(rMsg: Message, roles: Role[]) {
        if (roles.length > 10) {
            Log.error("Pack Creator", "Cannot auto create role reactions with more than 10 roles");
            return;
        }
        const reactions = ["1️⃣", "2️⃣", "3️⃣", "4️⃣", "5️⃣", "6️⃣", "7️⃣", "8️⃣", "9️⃣", "🔟"];
        const guildData = await ReactMessageModel.findOneOrCreate({ guildId: rMsg.guild!.id });

        let sepRole: Role | null;
        if (guildData.separatorRole && rMsg.guild) sepRole = await rMsg.guild.roles.fetch(guildData.separatorRole);

        //for each role, react with the next emoji, add the listener to it, add
        //it to the database.
        roles.forEach(async (role, idx) => {
            const reaction = reactions[idx];
            const filter = (r: MessageReaction, u: User) =>
                u.bot == false && (r.emoji.name == reaction || r.emoji.id == reaction);

            await rMsg.react(reaction);
            const collector = new ReactionCollector(rMsg, filter, { dispose: true })
                .on("collect", async (r: MessageReaction, u: User) => {
                    const member = await r.message.guild?.members.fetch(u.id);
                    member?.roles.add(role);
                    if (sepRole) member?.roles.add(sepRole);
                    Log.trace("React Role", `Added role ${role.name} to ${u.username}.`);
                })
                .on("remove", async (r: MessageReaction, u: User) => {
                    let member = await r.message.guild?.members.fetch(u.id);
                    member = await member?.roles.remove(role);
                    //remove the separator if it is now the highest colour of the user
                    if (sepRole) if (member?.roles.color == sepRole) await member?.roles.remove(sepRole);
                    Log.trace("React Role", `Removed role ${role.name} from ${u.username}.`);
                });

            Bot.Get.storeReactionListener(collector, reaction);

            await guildData.addReactionListener({
                channelId: rMsg.channel.id,
                messageId: rMsg.id,
                reaction: reaction,
                roleId: role.id,
            });
        });
    }
}

interface RoleDataArgs {
    name: string;
    color: string;
}
interface MsgInfoArgs {
    title: string;
    description: string;
    color: string;
    uri: string;
    channel: string;
}
