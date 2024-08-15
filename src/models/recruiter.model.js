import mongoose from "mongoose";
import { contactNumberSchemaType, emailSchemaType } from "./common.schemaTypes.js";

const recruiterSchema = new mongoose.Schema({
    email: { ...emailSchemaType, required: true},
    hash: { type: String, required: true },
    name: { type: String, required: true },
    contactNumbers: [contactNumberSchemaType],
    refreshTokens: [{ type: String }]
}, { timestamps: true });

export const Recruiter = mongoose.model('Recruiter', recruiterSchema);