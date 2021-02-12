import { Schema } from "mongoose";
import {
    findOneOrCreate,
    setLastUpdated,
    addReactionListener,
    declareSeparator,
    removeReactionListener,
} from "./ReactMessage.functions";

const ReactMessageSchema = new Schema({
    guildId: { type: String, unique: true },
    messages: [
        {
            channelId: String,
            messageId: String,
            reaction: String,
            roleId: String,
            duration: { type: Number, required: false },
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
ReactMessageSchema.methods.removeReactionListener = removeReactionListener;
ReactMessageSchema.methods.declareSeparator = declareSeparator;

export default ReactMessageSchema;
