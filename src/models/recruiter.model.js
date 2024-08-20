import mongoose from "mongoose";
import { contactNumberSchemaType, emailSchemaType } from "./common.schemaTypes.js";

const recruiterSchema = new mongoose.Schema({
    email: { ...emailSchemaType, required: [true, 'Email is required'] },
    hash: { type: String, required: [true, 'Hash is requried'] },
    name: { type: String, required: [true, 'Name is required'], trim: true },
    contactNumbers: [contactNumberSchemaType],
    refreshTokens: [{ type: String }]
}, { timestamps: true });

export const Recruiter = mongoose.model('Recruiter', recruiterSchema);