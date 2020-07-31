//Section: Instance Methods (for document)

import { IReactMessageDocument, IReactMessageModel } from "./ReactMessage.model";

export async function setLastUpdated(this: IReactMessageDocument): Promise<void> {
    const now = new Date();
    if (!this.lastUpdated || this.lastUpdated < now) {
        this.lastUpdated = now;
        await this.save();
    }
}

export async function addReactionListener(
    this: IReactMessageDocument,
    {
        channelId,
        messageId,
        reaction,
        roleId,
    }: { messageId: string; channelId: string; reaction: string; roleId: string }
): Promise<void> {
    this.messages.push({
        messageId: messageId,
        channelId: channelId,
        reaction: reaction,
        roleId: roleId,
    });
    this.setLastUpdated();
}

export async function removeReactionListener(
    this: IReactMessageDocument,
    { messageId, reaction }: { messageId: string; reaction: string }
): Promise<void> {
    const idx = this.messages.findIndex((rr) => rr.messageId == messageId && rr.reaction == reaction);
    this.messages.splice(idx, 1);

    this.setLastUpdated();
}

export async function declareSeparator(this: IReactMessageDocument, { roleId }: { roleId: string }): Promise<void> {
    this.separatorRole = roleId;
    this.setLastUpdated();
}

//Section: Static Methods (for model)

export async function findOneOrCreate(
    this: IReactMessageModel,
    { guildId }: { guildId: string }
): Promise<IReactMessageDocument> {
    const record: IReactMessageDocument | null = await this.findOne({ guildId: guildId });
    return record ?? (await this.create({ guildId: guildId, messages: [] }));
}
