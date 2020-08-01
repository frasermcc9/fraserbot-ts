import { IServerSettingsDocument, IServerSettingsModel } from "./ServerSettings.model";

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

//Section: Static Methods (for model)

export async function findOneOrCreate(
    this: IServerSettingsModel,
    { guildId }: { guildId: string }
): Promise<IServerSettingsDocument> {
    const record: IServerSettingsDocument | null = await this.findOne({ guildId: guildId });
    return record ?? (await this.create({ guildId: guildId, suggestions: { counter: 0 } }));
}

export async function removeGuild(this: IServerSettingsModel, { guildId }: { guildId: string }): Promise<void> {
    await this.findOneAndDelete({ guildId: guildId });
}
