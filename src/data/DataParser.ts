import { BaseSchema } from "./BaseScehma";
import { writeFile } from "fs";
import Log from "../helpers/Log";

export function DataParser<K extends BaseSchema>(path: string): K {
    return require(path) as K;
}

export async function DataWriter(path: string, data: string): Promise<void> {
    return new Promise((res, rej) => {
        writeFile(path, data, (cb) => {
            if (cb) {
                Log.error("Data Writer", "Error writing data to " + path, cb);
                rej();
            }
            res();
        });
    });
}
