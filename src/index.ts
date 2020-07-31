import Log from "./helpers/Log";
import { Bot } from "./Bot";
import { connect } from "./database/Database";

export const DatabaseConnection = {
    name: "emelbirb",
    uri: "mongodb://localhost:27017",
};

connect();

Bot.Get.start().catch((e) => {
    Log.critical("index", "Failed to startup bot and connect.", e);
});

process.on("uncaughtException", (error: Error) => handleException(error, "Uncaught Exception"));
process.on("unhandledRejection", (error: Error) => handleException(error, "Unhandled Promise Rejection"));

function handleException(error: Error, type: "Unhandled Promise Rejection" | "Uncaught Exception"): void {
    Log.error("Base Exception Handler", type + ": " + error.stack);
}
