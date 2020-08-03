import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, GuildMember } from "discord.js";

export default class BanCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "ban",
            group: "moderation",
            clientPermissions: ["BAN_MEMBERS"],
            userPermissions: ["BAN_MEMBERS"],
            memberName: "ban",
            description: "Bans the given member.",
            args: [
                {
                    key: "member",
                    prompt: "Who should be banned?",
                    type: "member",
                },
                {
                    key: "reason",
                    prompt: "What is the reason they are being banned?",
                    type: "string",
                    validate: (m: string) => m.length < 512,
                    default: "No reason.",
                },
                {
                    key: "deletions",
                    prompt: "How many days of their messages should be deleted (7 or less)?",
                    type: "integer",
                    default: 0,
                    validate: (n: number) => n < 7,
                },
            ],
        });
    }

    async run(
        message: CommandoMessage,
        { member, reason, deletions }: { member: GuildMember; reason: string; deletions: number }
    ): Promise<Message> {
        const bannedReason = `${reason} (Banned by ${message.author.username} - id: ${message.author.id})`;
        const bannedName = member.displayName;
        if (member.bannable) {
            member.ban({ reason: bannedReason, days: deletions });
            return message.channel.send(`${bannedName} was banned.`);
        } else {
            return message.channel.send(
                `I Cannot ban this member - most likely my role is not high enough in the ordering.`
            );
        }
    }
}
