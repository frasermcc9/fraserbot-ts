import { CommandoClient } from "discord.js-commando";
import Log from "./helpers/Log";
import path from "path";
import dotenv from "dotenv";
import { EventManager } from "./EventManager";

export class Bot extends CommandoClient {
    private static readonly bot: Bot = new Bot();

    static get Get(): Bot {
        return this.bot;
    }

    private constructor() {
        Log.logo();
        Log.trace("Bot", "Starting up bot");

        super({
            commandPrefix: "%",
            owner: "202917897176219648",
            invite: "https://discord.gg/rwFhQ9V",
            disableMentions: "everyone",
        });
    }

    async start(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            dotenv.config();
            if (process.env.TOKEN === undefined) {
                Log.error("Bot", "No token was provided.");
                return reject(new Error("REPLACEMENT_BOT_TOKEN is not provided"));
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
            .registerGroups([
                ["core", "Core bot commands"],
                ["moderation", "Moderation Commands"],
                ["colors", "Colour Commands"],
                ["fun","Fun Commands"]
            ])
            .registerCommandsIn({
                filter: /^([^.].*)\.(js|ts)$/,
                dirname: path.join(__dirname, "commands"),
            });
        Log.info("Bot", "Bot commands registered successfully");
    }

    private registerEvents(): void {
        new EventManager().init();
    }
}
