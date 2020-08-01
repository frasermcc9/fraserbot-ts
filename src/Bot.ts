import { CommandoClient } from "discord.js-commando";
import Log from "./helpers/Log";
import path from "path";
import dotenv from "dotenv";
import { EventManager } from "./EventManager";
import { ReactionCollector } from "discord.js";
dotenv.config();
export class Bot extends CommandoClient {
    private static readonly bot: Bot = new Bot();

    static get Get(): Bot {
        return this.bot;
    }

    private constructor() {
        Log.logo(process.env.BOTNAME ?? "");
        Log.trace("Bot", "Starting up bot");

        super({
            commandPrefix: "%",
            owner: "202917897176219648",
            invite: "https://discord.gg/rwFhQ9V",
            disableMentions: "everyone",
        });
        this.reactionListeners = new Map<string, ReactionCollector>();
    }

    async start(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (process.env.TOKEN === undefined) {
                Log.error("Bot", "No token was provided.");
                return reject(new Error("TOKEN is not provided"));
            }
            this.once("ready", () => {
                Log.info("Bot", `Bot logged in as ${this.user?.tag}`);
                this.registerCommands();
                this.registerEvents();
                resolve();
            });
            await this.login(process.env.TOKEN).catch((e) => {
                Log.error("Bot", "Bot failed to log in.", e);
                reject();
            });
        });
    }

    private registerCommands(): void {
        this.registry
            .registerDefaultTypes()
            .registerDefaultCommands({ unknownCommand: false })
            .registerGroups([
                ["core", "Core bot commands"],
                ["moderation", "Moderation Commands"],
                ["colors", "Colour Commands"],
                ["fun", "Fun Commands"],
                ["suggestions", "Suggestion Commands"],
            ])
            .registerCommandsIn({
                filter: /^([^.].*)\.(js|ts)$/,
                dirname: path.join(__dirname, "commands"),
            });
        Log.info("Bot", "Bot commands registered successfully");
    }

    private reactionListeners: Map<string, ReactionCollector>;
    public storeReactionListener(collector: ReactionCollector, reactionId: string) {
        const key = collector.message.id + reactionId;
        this.reactionListeners.set(key, collector);
    }
    public destroyReactionListener(messageId: string, reactionId: string) {
        const key = messageId + reactionId;
        this.reactionListeners.get(key)?.stop();
        this.reactionListeners.delete(key);
    }

    private registerEvents(): void {
        new EventManager().init();
    }
}
