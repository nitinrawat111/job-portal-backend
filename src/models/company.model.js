import mongoose from "mongoose";
import { addressSchema } from "./common.subSchemas.js";
import { linkSchemaType, emailSchemaType, contactNumberSchemaType } from "./common.schemaTypes.js";

const companySchema = new mongoose.Schema({
	name: { type: String, required: true },
	foundationYear: { type: Number },
	hqAddress: addressSchema,
	website: linkSchemaType,
	description: { type: String },
	emails: [emailSchemaType],
	contactNumbers: [contactNumberSchemaType],
	admin: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Recruiter',
		required: true
	},
	recruiters: {
		type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter' }],
		required: true,
		default: undefined
	}
}, { timestamps: true });

// Create the Mongoose model
export const Company = mongoose.model('Company', companySchema);