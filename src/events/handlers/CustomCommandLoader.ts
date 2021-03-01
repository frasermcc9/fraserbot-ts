import { BotEvent } from "../Events.interface";
import { Bot } from "../../Bot";
import Log from "../../helpers/Log";
import { ServerSettingsModel } from "../../database/models/Server/ServerSettings.model";
import { Message } from "discord.js";
import { CommandoMessage } from "discord.js-commando";

export default class ReactionRole implements BotEvent {
    private client: Bot = Bot.Get;

    /**
     * Initiates listeners for all reaction roles.
     */
    async start(): Promise<void> {
        const guildData = await ServerSettingsModel.find();

        for (let i = 0; i < guildData.length; i++) {
            const commands = await guildData[i].getCommands();
            const callers = Array.from(commands.keys());
            const responses = Array.from(commands.values());
            for (let j = 0; j < commands.size; j++) {
                const response = responses[j];
                const caller = callers[j];

                const gId = guildData[i].guildId;
                const fn = (m: Message) => {
                    const cmdMsg = m as CommandoMessage;
                    if (m.guild == null) return;
                    if (m.guild.id != gId) return;
                    if (!cmdMsg.argString) return;
                    if (m.cleanContent.toLowerCase() == `${cmdMsg.argString}${caller.toLowerCase()}`) {
                        return m.channel.send(response);
                    }
                };
                this.client.on("message", fn);
                this.client.storeCommandListener(fn, gId, caller);
            }
        }
    }
}
