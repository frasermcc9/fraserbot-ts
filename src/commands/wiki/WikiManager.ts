import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { Message, Role, Guild } from "discord.js";
import { ServerSettingsModel } from "../../database/models/Server/ServerSettings.model";
import Log from "../../helpers/Log";

export default class WikiManagerCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "wikimanager",
            group: "wiki",
            memberName: "wikimanager",
            description: "Decide the role that should be able to manage the wiki (permanently delete entries).",
            userPermissions: ["ADMINISTRATOR"],
            args: [
                {
                    key: "manager",
                    prompt: "Which role should be the manager?",
                    type: "role",
                    default: "",
                },
            ],
        });
    }

    async run(message: CommandoMessage, { manager }: { manager: Role | string }): Promise<Message> {
        const guildSettings = await ServerSettingsModel.findOneOrCreate({ guildId: message.guild.id });
        if (!guildSettings.wiki.enabled) {
            return message.channel.send("The wiki is not enabled in this server. An admin can enable it.");
        }

        if (manager == "") {
            const roleId = guildSettings.getWikiContentManager();
            if (roleId == undefined) {
                return message.channel.send("This server has no wiki manager.");
            } else {
                const role = message.guild.roles.resolve(roleId)?.name ?? "(DELETED)";
                return message.channel.send(`This server's role for wiki manager is ${role}.`);
            }
        }

        const role = message.guild.roles.resolve(manager);
        if (!role) {
            Log.error("WikiManager", "Error resolving passed role");
            return message.channel.send("An unknown error occurred when figuring out what role this refers to.");
        }
        guildSettings.setWikiContentManager({ roleId: role.id });
        return message.channel.send(`Wiki manager has been set to role ${role.name}!`);
    }
}
