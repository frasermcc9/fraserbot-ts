import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import {
    Message,
    Channel,
    Role,
    TextChannel,
    ReactionCollector,
    ReactionEmoji,
    User,
    MessageReaction,
} from "discord.js";
import { ReactMessageModel } from "../../database/models/ReactMessage/ReactMessage.model";
import Log from "../../helpers/Log";

export default class DeclareSeparatorCommand extends Command {
    constructor(client: CommandoClient) {
        super(client, {
            name: "declareseparator",
            group: "roles",
            memberName: "declareseparator",
            description: "Declares a separator role for colours.",
            userPermissions: ["ADMINISTRATOR"],
            args: [
                {
                    key: "role",
                    prompt: "The separator role that should be added to people when they react to ReactRoles.",
                    type: "role",
                },
            ],
        });
    }

    async run(message: CommandoMessage, { role }: ICommandArgs): Promise<Message> {
        const guildData = await ReactMessageModel.findOneOrCreate({ guildId: message.guild.id });
        guildData.declareSeparator({ roleId: role.id });

        return message.channel.send("Separator Role Added!");
    }
}

interface ICommandArgs {
    role: Role;
}
