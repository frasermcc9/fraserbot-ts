import { IServerSettingsDocument, IServerSettingsModel, WikiEntry } from "./ServerSettings.model";
import { Bot } from "../../../Bot";

//Section: Instance Methods (for document)

export async function setLastUpdated(this: IServerSettingsDocument): Promise<void> {
    const now = new Date();
    if (!this.lastUpdated || this.lastUpdated < now) {
        this.lastUpdated = now;
        await this.save();
    }
    Bot.Get.refreshCachePoint(this);
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

export async function setWikiEnabled(this: IServerSettingsDocument, { setting }: { setting: boolean }): Promise<void> {
    this.wiki.enabled = setting;
    if (!this.wiki.entries || this.wiki.entries == {}) {
        this.wiki.entries = {};
        await this.updateWikiEntry({ title: "First Wiki Entry", content: "Welcome to the wiki!", author: "Fraserbot" });
    }
    this.markModified("wiki");
    await this.setLastUpdated();
}
export function getWikiEntry(this: IServerSettingsDocument, { title }: { title: string }): WikiEntry | undefined {
    return this.wiki.entries[title];
}
export async function deleteWikiEntry(this: IServerSettingsDocument, { title }: { title: string }): Promise<boolean> {
    if (this.wiki.entries[title]) {
        delete this.wiki.entries[title];
        this.markModified("wiki");
        await this.setLastUpdated();
        return true;
    } else {
        return false;
    }
}
export async function updateWikiEntry(
    this: IServerSettingsDocument,
    { title, content, author }: { title: string; content: string; author: string }
): Promise<void> {
    const current = this.wiki.entries[title];
    if (current == undefined) {
        this.wiki.entries[title] = {
            title: title,
            authors: [[author, new Date()]],
            content: content,
        };
    } else {
        this.wiki.entries[title].title = title;
        this.wiki.entries[title].authors.push([author, new Date()]);
        this.wiki.entries[title].content = content;
    }
    this.markModified("wiki");
    await this.setLastUpdated();
}

export async function setWikiContentManager(
    this: IServerSettingsDocument,
    { roleId }: { roleId: string }
): Promise<void> {
    this.wiki.contentManager = roleId;
    this.markModified("wiki");
    await this.setLastUpdated();
}

export function getWikiContentManager(this: IServerSettingsDocument): string | undefined {
    return this.wiki.contentManager;
}

export function getAllWikiEntries(this: IServerSettingsDocument): { [k: string]: WikiEntry } {
    return this.wiki.entries;
}

//Section: Static Methods (for model)

export async function findOneOrCreate(
    this: IServerSettingsModel,
    { guildId }: { guildId: string }
): Promise<IServerSettingsDocument> {
    let record: IServerSettingsDocument | null = await this.findOne({ guildId: guildId });
    if (record == null) {
        record = await this.create({
            guildId: guildId,
            suggestions: { counter: 0 },
            guildCommands: new Map(),
            wiki: {
                enabled: false,
                entries: {},
            },
        });
        Bot.Get.refreshCachePoint(record);
    }
    return record;
}

export async function removeGuild(this: IServerSettingsModel, { guildId }: { guildId: string }): Promise<void> {
    await this.findOneAndDelete({ guildId: guildId });
}
