import { model, Model, Document } from "mongoose";
import MemberCountSchema from "./MemberCount.Schema";

export const MemberCountModel = model<IMemberCountDocument>("memberCounts", MemberCountSchema) as IMemberCountModel;

export interface IMemberCount {
    guildId: string;
    channelId?: string;
    dateOfEntry?: Date;
    lastUpdated?: Date;
}
export interface IMemberCountDocument extends IMemberCount, Document {
    setLastUpdated(this: IMemberCountDocument): Promise<void>;
    setMemberCountChannel(this: IMemberCountDocument, { channelId }: { channelId: string }): Promise<void>;
    getMemberCountChannel(this: IMemberCountDocument): string | undefined;
}
export interface IMemberCountModel extends Model<IMemberCountDocument> {
    findOneOrCreate(this: IMemberCountModel, { guildId }: { guildId: string }): Promise<IMemberCountDocument>;
    removeGuild(this: IMemberCountModel, { guildId }: { guildId: string }): Promise<void>;
}
