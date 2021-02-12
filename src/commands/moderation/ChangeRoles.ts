import { get } from "http";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, GuildMember, Role, Guild } from "discord.js";

export default class KickCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "changerole",
            group: "moderation",
            clientPermissions: ["MANAGE_ROLES"],
            userPermissions: ["MANAGE_ROLES"],
            memberName: "changerole",
            description: "Moves everyones parts up by one.",
        });
    }

    private orderedSwitch: [string, string][] = [];

    async run(message: CommandoMessage): Promise<Message> {
        this.orderedSwitch.push(
            ["Part IV", "'Professional' Engineer"],
            ["Part III", "Part IV"],
            ["Part II", "Part III"],
            ["Part I", "Part II"]
        );
        const memberList = (await message.guild.members.fetch()).array();

        for (const transition of this.orderedSwitch) {
            const from = message.guild.roles.cache.find((r) => r.name == transition[0]);
            const to = message.guild.roles.cache.find((r) => r.name == transition[1]);
            if (!from || !to) {
                throw new RangeError(`Failed to find roles for transition ${transition[0]} => ${transition[1]}`);
            }
            await this.switchRole(memberList, from, to);
        }
        return message.channel.send("Roles switched for all members!");
    }

    private switchRole = async (memberList: GuildMember[], from: Role, to: Role) => {
        return new Promise(async (res) => {
            const membersWithRole = this.getMembersInRole(memberList, from);
            for (const member of membersWithRole) {
                await member.roles.remove(from);
                await member.roles.add(to);
                console.log(`${member.user.username} has been updated!`);
            }
            res("complete");
        });
    };

    private getMembersInRole = (memberList: GuildMember[], role: Role): GuildMember[] => {
        return memberList.filter((m) => m.roles.cache.has(role.id));
    };
}
