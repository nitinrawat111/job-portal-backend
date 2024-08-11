import mongoose from "mongoose";
import { contactNumberSchemaType, emailSchemaType, timestampSchemaType } from "./common.schemaTypes.js";

const recruiterSchema = new mongoose.Schema({
    email: { ...emailSchemaType, required: true},
    hash: { type: String, required: true },
    name: { type: String, required: true },
    contactNumbers: [contactNumberSchemaType],
    registrationTimestamp: timestampSchemaType,
    refreshTokens: [{ type: String }]
});

export const Recruiter = mongoose.model('Recruiter', recruiterSchema);