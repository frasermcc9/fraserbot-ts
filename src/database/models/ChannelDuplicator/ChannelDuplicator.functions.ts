import { IChannelDuplicatorDocument, IChannelDuplicatorModel } from "./ChannelDuplicator.model";

//Section: Instance Methods (for document)

export async function setLastUpdated(this: IChannelDuplicatorDocument): Promise<void> {
    const now = new Date();
    if (!this.lastUpdated || this.lastUpdated < now) {
        this.lastUpdated = now;
        await this.save();
    }
}

export async function addGuildChannel(
    this: IChannelDuplicatorDocument,
    { channelId }: { channelId: string }
): Promise<void> {
    this.channelIds.push(channelId);
    await this.setLastUpdated();
}

export async function removeGuildChannel(
    this: IChannelDuplicatorDocument,
    { channelId }: { channelId: string }
): Promise<void> {
    const index = this.channelIds.indexOf(channelId);
    this.channelIds.splice(index, 1);
    await this.setLastUpdated();
}

//Section: Static Methods (for model)

export async function findOneOrCreate(
    this: IChannelDuplicatorModel,
    { guildId }: { guildId: string }
): Promise<IChannelDuplicatorDocument> {
    const record: IChannelDuplicatorDocument | null = await this.findOne({ guildId: guildId });
    return record ?? (await this.create({ guildId: guildId, channelIds: [] }));
}

export async function getGuildChannels(
    this: IChannelDuplicatorModel,
    { guildId }: { guildId: string }
): Promise<string[]> {
    return (await this.findOneOrCreate({ guildId: guildId })).channelIds;
}
