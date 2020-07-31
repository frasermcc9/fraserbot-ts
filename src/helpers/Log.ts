import chalk = require("chalk");
import figlet = require("figlet");

export default abstract class Log {
    static debug(src: string, msg: string): void {
        this.log("DEBUG", src, msg);
    }
    static trace(src: string, msg: string, error?: Error): void {
        this.log("TRACE", src, msg, error);
    }
    static info(src: string, msg: string, error?: Error): void {
        this.log("INFO", src, msg, error);
    }
    static warn(src: string, msg: string, error?: Error): void {
        this.log("WARN", src, msg, error);
    }
    static error(src: string, msg: string, error?: Error): void {
        this.log("ERROR", src, msg, error);
    }
    static critical(src: string, msg: string, error?: Error): void {
        this.log("CRITICAL", src, msg, error);
        process.exit();
    }
    static logo(): void {
        console.log(chalk.blue(figlet.textSync("Fraserbot-ts")));
        console.log();
    }

    private static log(severity: Severity, src: string, msg: string, error?: Error): void {
        const c = this.colorResolver(severity);
        console.log(c.bold(`[${severity}] `) + c(`${src} - ${msg}${this.formatError(error)}`));
    }
    private static colorResolver(severity: Severity) {
        switch (severity) {
            case "DEBUG":
                return chalk.grey;
            case "TRACE":
                return chalk.whiteBright;
            case "INFO":
                return chalk.green;
            case "WARN":
                return chalk.yellow;
            case "ERROR":
                return chalk.red;
            default:
                return chalk.whiteBright.bgRed;
        }
    }
    private static formatError(error?: Error): string {
        if (error != null) {
            const stack = error.stack!.replace(error.name + ": " + error.message + "\n", "");
            return "\r\n" + chalk.bold(error.name) + ": " + error.message + "\r\n" + chalk.gray(stack);
        } else {
            return "";
        }
    }
}

type Severity = "DEBUG" | "TRACE" | "INFO" | "WARN" | "ERROR" | "CRITICAL";
