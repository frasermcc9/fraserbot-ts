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
        counter: number;
    };
    dadBot?: boolean;
    guildCommands: Map<string, string> | undefined;
    wiki: {
        enabled: boolean;
        contentManager?: string;
        entries: {
            [k: string]: WikiEntry;
        };
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

    setDadbot(this: IServerSettingsDocument, { setting }: { setting: boolean }): Promise<void>;

    addCommand(this: IServerSettingsDocument, { name, response }: { name: string; response: string }): Promise<void>;
    deleteCommand(this: IServerSettingsDocument, { name }: { name: string }): Promise<boolean>;
    getCommands(this: IServerSettingsDocument): Promise<Map<string, string>>;

    setWikiEnabled(this: IServerSettingsDocument, { setting }: { setting: boolean }): Promise<void>;
    getWikiEntry(this: IServerSettingsDocument, { title }: { title: string }): WikiEntry | undefined;
    deleteWikiEntry(this: IServerSettingsDocument, { title }: { title: string }): Promise<boolean>;
    updateWikiEntry(
        this: IServerSettingsDocument,
        { title, content, author }: { title: string; content: string; author: string }
    ): Promise<void>;
    setWikiContentManager(this: IServerSettingsDocument, { roleId }: { roleId: string }): Promise<void>;
    getWikiContentManager(this: IServerSettingsDocument): string | undefined;
    getAllWikiEntries(this: IServerSettingsDocument): { [k: string]: WikiEntry };
}
export interface IServerSettingsModel extends Model<IServerSettingsDocument> {
    findOneOrCreate(this: IServerSettingsModel, { guildId }: { guildId: string }): Promise<IServerSettingsDocument>;
    removeGuild(this: IServerSettingsModel, { guildId }: { guildId: string }): Promise<void>;
}

export interface WikiEntry {
    title: string;
    content: string;
    authors: [string, Date][];
}
