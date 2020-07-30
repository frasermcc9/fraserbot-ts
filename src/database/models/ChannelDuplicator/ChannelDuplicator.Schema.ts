import { Schema } from "mongoose";
import {
    setLastUpdated,
    findOneOrCreate,
    removeGuildChannel,
    addGuildChannel,
    getGuildChannels,
} from "./ChannelDuplicator.functions";

const ChannelDuplicatorSchema = new Schema({
    guildId: { type: String, unique: true },
    channelIds: [String],
    dateOfEntry: {
        type: Date,
        default: new Date(),
    },
    lastUpdated: {
        type: Date,
        default: new Date(),
    },
});

ChannelDuplicatorSchema.statics.findOneOrCreate = findOneOrCreate;
ChannelDuplicatorSchema.statics.getGuildChannels = getGuildChannels;

ChannelDuplicatorSchema.methods.addGuildChannel = addGuildChannel;
ChannelDuplicatorSchema.methods.removeGuildChannel = removeGuildChannel;
ChannelDuplicatorSchema.methods.setLastUpdated = setLastUpdated;

export default ChannelDuplicatorSchema;
