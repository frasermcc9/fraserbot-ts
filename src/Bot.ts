import { CommandoClient, CommandoMessage } from "discord.js-commando";
import Log from "./helpers/Log";
import path from "path";
import dotenv from "dotenv";
import { EventManager } from "./EventManager";
import { ReactionCollector, MessageCollector as Function, Message } from "discord.js";
import { ServerSettingsModel, IServerSettingsDocument } from "./database/models/Server/ServerSettings.model";
import * as stockClient from "stocksim";

dotenv.config();
export class Bot extends CommandoClient {
    private static readonly bot: Bot = new Bot();

    static get Get(): Bot {
        return this.bot;
    }

    private constructor() {
        Log.logo(process.env.BOTNAME ?? "");
        Log.trace("Bot", `Starting up bot with name ${process.env.BOTNAME}`);

        super({
            commandPrefix: "%",
            owner: "202917897176219648",
            invite: "https://discord.gg/rwFhQ9V",
            disableMentions: "everyone",
        });
        this.reactionListeners = new Map();
        this.commandListeners = new Map();
        this.guildSettingsCache = new Map();
    }

    async start(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            if (process.env.TOKEN === undefined) {
                Log.error("Bot", "No token was provided.");
                return reject(new Error("TOKEN is not provided"));
            }
            this.once("ready", async () => {
                Log.info("Bot", `Bot logged in as ${this.user?.tag}`);
                await this.refreshCache();
                this.registerCommands();
                this.registerEvents();
                resolve();
            });
            await this.login(process.env.TOKEN).catch((e) => {
                Log.error("Bot", "Bot failed to log in.", e);
                reject();
            });
            this.initiateStockGame();
        });
    }

    private registerCommands(): void {
        this.registry
            .registerDefaultGroups()
            .registerDefaultTypes()
            .registerDefaultCommands({ unknownCommand: false, ping: false, prefix: false })
            .registerGroups([
                ["core", "Core bot commands"],
                ["moderation", "Moderation Commands"],
                ["roles", "Commands relating to role reactions"],
                ["fun", "Fun Commands"],
                ["suggestions", "Suggestion Commands"],
                ["config", "Commands for bot settings in this server"],
                ["messages", "Custom commands and quotes"],
                ["wiki", "Commands for the wiki"],
                ["stocks", "Stock market simulator"],
            ])

            .registerCommandsIn({
                filter: /^([^.].*)\.(js|ts)$/,
                dirname: path.join(__dirname, "commands"),
            });
        Log.info("Bot", "Bot commands registered successfully");
    }

    private initiateStockGame() {
        stockClient.Client.CreateClient({
            dbName: "stocksim",
            iexKey: process.env.IEX_TOKEN!,
            uri: "mongodb://localhost:27017",
            newUserValue: 1000,
        });
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

    private commandListeners: Map<string, (m: CommandoMessage) => void>;
    public storeCommandListener(fn: (m: CommandoMessage) => void, guildId: string, commandName: string) {
        const key = guildId + commandName;
        this.commandListeners.set(key, fn);
    }
    public destroyCommandListener(guildId: string, commandName: string) {
        const key = guildId + commandName;
        const fn = this.commandListeners.get(key);
        if (!fn) return;
        this.off("message", fn);
        this.commandListeners.delete(key);
    }

    private registerEvents(): void {
        new EventManager().init();
    }

    private guildSettingsCache: Map<string, IServerSettingsDocument>;
    public get GuildSettingsCache() {
        return this.guildSettingsCache;
    }
    /**
     * refreshes the entire settings cache from database.
     */
    public async refreshCache() {
        const data = await ServerSettingsModel.find();
        data.forEach((doc) => {
            this.guildSettingsCache.set(doc.guildId, doc);
        });
    }
    /**
     * Updates the cache at a single position.
     * @param guild the settings of the guild to update.
     */
    public refreshCachePoint(guild: IServerSettingsDocument) {
        this.guildSettingsCache.set(guild.guildId, guild);
    }
}
