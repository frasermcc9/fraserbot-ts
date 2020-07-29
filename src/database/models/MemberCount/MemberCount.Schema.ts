import { Schema } from "mongoose";
import {  setLastUpdated, setMemberCountChannel, getMemberCountChannel, findOneOrCreate, removeGuild } from "./MemberCount.functions";

const MemberCountSchema = new Schema({
    guildId: { type: String, unique: true },
    channelId: { type: String, required: false },
    dateOfEntry: {
        type: Date,
        default: new Date(),
    },
    lastUpdated: {
        type: Date,
        default: new Date(),
    },
});


MemberCountSchema.statics.findOneOrCreate = findOneOrCreate;
MemberCountSchema.statics.removeGuild = removeGuild;

MemberCountSchema.methods.setMemberCountChannel = setMemberCountChannel;
MemberCountSchema.methods.getMemberCountChannel = getMemberCountChannel;
MemberCountSchema.methods.setLastUpdated = setLastUpdated;

export default MemberCountSchema;
