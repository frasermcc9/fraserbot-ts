import { IServerSettingsDocument, IServerSettingsModel } from "./ServerSettings.model";
import { Bot } from "../../../Bot";
import { throws } from "assert";

//Section: Instance Methods (for document)

export async function setLastUpdated(this: IServerSettingsDocument): Promise<void> {
    const now = new Date();
    if (!this.lastUpdated || this.lastUpdated < now) {
        this.lastUpdated = now;
        await this.save();
    }
}

export function getMemberCountChannel(this: IServerSettingsDocument): string | undefined {
    return this.channelId;
}

export async function setMemberCountChannel(
    this: IServerSettingsDocument,
    { channelId }: { channelId: string }
): Promise<void> {
    this.channelId = channelId;
    await this.setLastUpdated();
}

export async function setPrefix(this: IServerSettingsDocument, { prefix }: { prefix: string }) {
    this.prefix = prefix;
    return await this.setLastUpdated();
}

export function getPrefix(this: IServerSettingsDocument): string | undefined {
    return this.prefix;
}

export async function setSuggestionChannel(this: IServerSettingsDocument, { channelId }: { channelId: string }) {
    this.suggestions.channel = channelId;
    return await this.setLastUpdated();
}

export function getSuggestionChannel(this: IServerSettingsDocument): string | undefined {
    return this.suggestions.channel;
}

export async function incrementSuggestions(this: IServerSettingsDocument): Promise<number> {
    this.suggestions.counter += 1;
    await this.setLastUpdated();
    return this.suggestions.counter;
}

export async function setDadbot(this: IServerSettingsDocument, { setting }: { setting: boolean }): Promise<void> {
    this.dadBot = setting;
    return await this.setLastUpdated();
}

export async function addCommand(
    this: IServerSettingsDocument,
    { name, response }: { name: string; response: string }
): Promise<void> {
    if (this.guildCommands == undefined) {
        this.guildCommands = new Map<string, string>();
    }
    this.guildCommands.set(name, response);
    await this.setLastUpdated();
}

export async function deleteCommand(this: IServerSettingsDocument, { name }: { name: string }): Promise<boolean> {
    const result = this.guildCommands?.has(name);
    this.guildCommands?.delete(name);
    Bot.Get.destroyCommandListener(this.guildId, name);
    await this.setLastUpdated();
    return result ?? false;
}

export async function getCommands(this: IServerSettingsDocument): Promise<Map<string, string>> {
    if (this.guildCommands == undefined) {
        this.guildCommands = new Map<string, string>();
        await this.setLastUpdated();
    }
    return this.guildCommands;
}

//Section: Static Methods (for model)

export async function findOneOrCreate(
    this: IServerSettingsModel,
    { guildId }: { guildId: string }
): Promise<IServerSettingsDocument> {
    let record: IServerSettingsDocument | null = await this.findOne({ guildId: guildId });
    if (record == null) {
        record = await this.create({ guildId: guildId, suggestions: { counter: 0 }, guildCommands: new Map() });
        Bot.Get.refreshCachePoint(record);
    }
    return record;
}

export async function removeGuild(this: IServerSettingsModel, { guildId }: { guildId: string }): Promise<void> {
    await this.findOneAndDelete({ guildId: guildId });
}
