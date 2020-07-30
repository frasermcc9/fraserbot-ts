import { Schema } from "mongoose";
import { findOneOrCreate, setLastUpdated, addReactionListener, declareSeparator } from "./ReactMessage.functions";

const ReactMessageSchema = new Schema({
    guildId: { type: String, unique: true },
    messages: [
        {
            channelId: String,
            messageId: String,
            reaction: String,
            roleId: String,
        },
    ],
    separatorRole: { type: String, required: false },
    dateOfEntry: {
        type: Date,
        default: new Date(),
    },
    lastUpdated: {
        type: Date,
        default: new Date(),
    },
});

ReactMessageSchema.statics.findOneOrCreate = findOneOrCreate;

ReactMessageSchema.methods.setLastUpdated = setLastUpdated;
ReactMessageSchema.methods.addReactionListener = addReactionListener;
ReactMessageSchema.methods.declareSeparator = declareSeparator;

export default ReactMessageSchema;
