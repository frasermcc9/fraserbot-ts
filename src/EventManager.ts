import { BotEvent } from "./events/Events.interface";
import Log from "./helpers/Log";

export class EventManager {
    constructor() {}

    public init() {
        const events = require("require-all")({
            dirname: __dirname + "/events/handlers",
        });
        for (const name in events) {
            const event = new events[name].default() as BotEvent;
            event.start();
        }
        Log.info("Bot", "Bot events registered successfully");
    }
}
