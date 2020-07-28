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

        this.on("commandError", (command, error, message) => {
            Log.error("Command Error", `Error with ${command.name}. Message sent: ${message.content}.`, error);
        });
    }

    async start(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            dotenv.config();
            if (process.env.TOKEN === undefined) {
                Log.error("Bot", "No token was provided.");
                return reject(new Error("REPLACEMENT_BOT_TOKEN is not provided"));
            }
            await this.login(process.env.TOKEN).catch((e) => {
                Log.error("Bot", "Bot failed to log in.", e);
                reject();
            });
            Log.trace("Bot", `Bot logged in as ${this.user?.tag}`);
            this.registerCommands();
            this.registerEvents();
            resolve();
        });
    }

    private registerCommands(): void {
        this.registry
            .registerDefaultTypes()
            .registerGroups([
                ["core", "Core bot commands"],
                ["moderation", "Moderation Commands"],
                ["colors", "Colour Commands"],
            ])
            .registerCommandsIn({
                filter: /^([^.].*)\.(js|ts)$/,
                dirname: path.join(__dirname, "commands"),
            });
        Log.trace("Bot", "Bot commands registered successfully");
    }

    private registerEvents(): void {
        new EventManager();
        this.on("debug", (info) => Log.info("Bot", info));
        Log.trace("Bot", "Bot events registered successfully");
    }
}
