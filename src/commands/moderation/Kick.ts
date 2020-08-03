import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, GuildMember } from "discord.js";

export default class KickCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "kick",
            group: "moderation",
            clientPermissions: ["KICK_MEMBERS"],
            userPermissions: ["KICK_MEMBERS"],
            memberName: "kick",
            description: "Kicks the given member.",
            args: [
                {
                    key: "member",
                    prompt: "Who should be kicked?",
                    type: "member",
                },
                {
                    key: "reason",
                    prompt: "What is the reason they are being kicked?",
                    type: "string",
                    validate: (m: string) => m.length < 512,
                    default: "No reason.",
                },
            ],
        });
    }

    async run(message: CommandoMessage, { member, reason }: { member: GuildMember; reason: string }): Promise<Message> {
        const kickedReason = `${reason} (Kicked by ${message.author.username} - id: ${message.author.id})`;
        const kickedName = member.displayName;
        if (member.kickable) {
            member.kick(kickedReason);
            return message.channel.send(`${kickedName} was kicked.`);
        } else {
            return message.channel.send(
                `I Cannot kick this member - most likely my role is not high enough in the ordering.`
            );
        }
    }
}
