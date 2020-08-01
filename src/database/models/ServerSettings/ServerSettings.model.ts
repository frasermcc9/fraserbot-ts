import { model, Model, Document } from "mongoose";
import ServerSettingsSchema from "./ServerSettings.schema";

export const ServerSettingsModel = model<IServerSettingsDocument>(
    "memberCounts",
    ServerSettingsSchema
) as IServerSettingsModel;

export interface IMemberCount {
    guildId: string;
    channelId?: string;
    prefix?: string;
    suggestions: {
        channel?: string;
        count?: number;
    };
    dateOfEntry?: Date;
    lastUpdated?: Date;
}
export interface IServerSettingsDocument extends IMemberCount, Document {
    setLastUpdated(this: IServerSettingsDocument): Promise<void>;
    setMemberCountChannel(this: IServerSettingsDocument, { channelId }: { channelId: string }): Promise<void>;
    getMemberCountChannel(this: IServerSettingsDocument): string | undefined;

    setPrefix(this: IServerSettingsDocument, { prefix }: { prefix: string }): Promise<void>;
    getPrefix(this: IServerSettingsDocument): string | undefined;

    setSuggestionChannel(this: IServerSettingsDocument, { channelId }: { channelId: string }): Promise<void>;
    getSuggestionChannel(this: IServerSettingsDocument): string | undefined;
    incrementSuggestions(this: IServerSettingsDocument): Promise<number>;
}
export interface IServerSettingsModel extends Model<IServerSettingsDocument> {
    findOneOrCreate(this: IServerSettingsModel, { guildId }: { guildId: string }): Promise<IServerSettingsDocument>;
    removeGuild(this: IServerSettingsModel, { guildId }: { guildId: string }): Promise<void>;
}
