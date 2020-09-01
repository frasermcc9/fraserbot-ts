import { Schema } from "mongoose";
import {
    setLastUpdated,
    setMemberCountChannel,
    getMemberCountChannel,
    findOneOrCreate,
    removeGuild,
    setPrefix,
    getPrefix,
    setSuggestionChannel,
    getSuggestionChannel,
    incrementSuggestions,
    setDadbot,
    addCommand,
    deleteCommand,
    getCommands,
    deleteWikiEntry,
    getWikiEntry,
    getWikiContentManager,
    setWikiContentManager,
    setWikiEnabled,
    getAllWikiEntries,
    updateWikiEntry,
} from "./ServerSettings.functions";

const ServerSettingsSchema = new Schema({
    guildId: { type: String, unique: true },
    memberCounter: { type: String, required: false },
    prefix: { type: String, required: false },
    suggestions: {
        channel: { type: String, required: false },
        counter: { type: Number, default: 0 },
    },
    dadBot: { type: Boolean, required: false },
    guildCommands: { type: Map, required: false },
    wiki: {
        enabled: { type: Boolean, default: false },
        contentManager: { type: String, required: false },
        entries: {
            type: {},
        },
    },
    dateOfEntry: {
        type: Date,
        default: new Date(),
    },
    lastUpdated: {
        type: Date,
        default: new Date(),
    },
});

ServerSettingsSchema.statics.findOneOrCreate = findOneOrCreate;
ServerSettingsSchema.statics.removeGuild = removeGuild;

ServerSettingsSchema.methods.setMemberCountChannel = setMemberCountChannel;
ServerSettingsSchema.methods.getMemberCountChannel = getMemberCountChannel;

ServerSettingsSchema.methods.setPrefix = setPrefix;
ServerSettingsSchema.methods.getPrefix = getPrefix;

ServerSettingsSchema.methods.setSuggestionChannel = setSuggestionChannel;
ServerSettingsSchema.methods.getSuggestionChannel = getSuggestionChannel;
ServerSettingsSchema.methods.incrementSuggestions = incrementSuggestions;

ServerSettingsSchema.methods.setDadbot = setDadbot;

ServerSettingsSchema.methods.addCommand = addCommand;
ServerSettingsSchema.methods.deleteCommand = deleteCommand;
ServerSettingsSchema.methods.getCommands = getCommands;

ServerSettingsSchema.methods.setWikiEnabled = setWikiEnabled;
ServerSettingsSchema.methods.deleteWikiEntry = deleteWikiEntry;
ServerSettingsSchema.methods.getWikiEntry = getWikiEntry;
ServerSettingsSchema.methods.updateWikiEntry = updateWikiEntry;
ServerSettingsSchema.methods.getWikiContentManager = getWikiContentManager;
ServerSettingsSchema.methods.setWikiContentManager = setWikiContentManager;
ServerSettingsSchema.methods.getAllWikiEntries = getAllWikiEntries;
ServerSettingsSchema.methods.setLastUpdated = setLastUpdated;

export default ServerSettingsSchema;
