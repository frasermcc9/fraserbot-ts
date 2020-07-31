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

//Section: Static Methods (for model)

export async function findOneOrCreate(
    this: IServerSettingsModel,
    { guildId }: { guildId: string }
): Promise<IServerSettingsDocument> {
    const record: IServerSettingsDocument | null = await this.findOne({ guildId: guildId });
    return record ?? (await this.create({ guildId: guildId }));
}

export async function removeGuild(this: IServerSettingsModel, { guildId }: { guildId: string }): Promise<void> {
    await this.findOneAndDelete({ guildId: guildId });
}
