import { model, Model, Document } from "mongoose";
import MemberCountSchema from "./ChannelDuplicator.Schema";

export const ChannelDuplicatorModel = model<IChannelDuplicatorDocument>(
    "channelDuplicators",
    MemberCountSchema
) as IChannelDuplicatorModel;

export interface IMemberCount {
    guildId: string;
    channelIds: [string];
    dateOfEntry?: Date;
    lastUpdated?: Date;
}
export interface IChannelDuplicatorDocument extends IMemberCount, Document {
    setLastUpdated(this: IChannelDuplicatorDocument): Promise<void>;
    removeGuildChannel(this: IChannelDuplicatorDocument, { channelId }: { channelId: string }): Promise<void>;
    addGuildChannel(this: IChannelDuplicatorDocument, { channelId }: { channelId: string }): Promise<void>;
}
export interface IChannelDuplicatorModel extends Model<IChannelDuplicatorDocument> {
    findOneOrCreate(
        this: IChannelDuplicatorModel,
        { guildId }: { guildId: string }
    ): Promise<IChannelDuplicatorDocument>;
    getGuildChannels(this: IChannelDuplicatorModel, { guildId }: { guildId: string }): Promise<string[]>;
}
