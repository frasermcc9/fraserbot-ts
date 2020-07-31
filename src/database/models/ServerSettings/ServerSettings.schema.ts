import { Schema } from "mongoose";
import {
    setLastUpdated,
    setMemberCountChannel,
    getMemberCountChannel,
    findOneOrCreate,
    removeGuild,
    setPrefix,
    getPrefix,
} from "./ServerSettings.functions";

const ServerSettingsSchema = new Schema({
    guildId: { type: String, unique: true },
    memberCounter: { type: String, required: false },
    prefix: { type: String, required: false },
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
ServerSettingsSchema.methods.setLastUpdated = setLastUpdated;

export default ServerSettingsSchema;
