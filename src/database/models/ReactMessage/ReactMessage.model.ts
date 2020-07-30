import { model, Model, Document } from "mongoose";
import MemberCountSchema from "./ReactMessage.schema";

export const ReactMessageModel = model<IReactMessageDocument>("reactMessage", MemberCountSchema) as IReactMessageModel;

export interface IReactionMessage {
    guildId: string;
    messages: { channelId: string; messageId: string; reaction: string; roleId: string }[];
    separatorRole?: string;
    dateOfEntry?: Date;
    lastUpdated?: Date;
}
export interface IReactMessageDocument extends IReactionMessage, Document {
    setLastUpdated(this: IReactMessageDocument): Promise<void>;
    addReactionListener(
        this: IReactMessageDocument,
        {
            channelId,
            messageId,
            reaction,
            roleId,
        }: { messageId: string; channelId: string; reaction: string; roleId: string }
    ): Promise<void>;
    declareSeparator(this: IReactMessageDocument, { roleId }: { roleId: string }): Promise<void>;
}
export interface IReactMessageModel extends Model<IReactMessageDocument> {
    findOneOrCreate(this: IReactMessageModel, { guildId }: { guildId: string }): Promise<IReactMessageDocument>;
}
