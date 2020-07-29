import { IMemberCountDocument, IMemberCountModel } from "./MemberCount.model";

//Section: Instance Methods (for document)

export async function setLastUpdated(this: IMemberCountDocument): Promise<void> {
    const now = new Date();
    if (!this.lastUpdated || this.lastUpdated < now) {
        this.lastUpdated = now;
        await this.save();
    }
}

export function getMemberCountChannel(this: IMemberCountDocument): string | undefined {
    return this.channelId;
}

export async function setMemberCountChannel(
    this: IMemberCountDocument,
    { channelId }: { channelId: string }
): Promise<void> {
    this.channelId = channelId;
    await this.setLastUpdated();
}

//Section: Static Methods (for model)

export async function findOneOrCreate(
    this: IMemberCountModel,
    { guildId }: { guildId: string }
): Promise<IMemberCountDocument> {
    const record: IMemberCountDocument | null = await this.findOne({ guildId: guildId });
    return record ?? (await this.create({ guildId: guildId }));
}

export async function removeGuild(this: IMemberCountModel, { guildId }: { guildId: string }): Promise<void> {
    await this.findOneAndDelete({ guildId: guildId });
}
