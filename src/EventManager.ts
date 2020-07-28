import { BotEvent } from "./events/Events.interface";

export class EventManager {
    constructor() {
        const events = require("require-all")({
            dirname: __dirname + "/events/handlers",
        });
        for (const name in events) {
            const event =new events[name].default() as BotEvent;
            event.start();
        }
    }
}
