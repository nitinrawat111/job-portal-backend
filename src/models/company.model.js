import mongoose from "mongoose";
import { addressSchema } from "./common.subSchemas.js";
import { linkSchemaType, emailSchemaType, contactNumberSchemaType } from "./common.schemaTypes.js";

const companySchema = new mongoose.Schema({
	name: { type: String, required: [true, "Name is required"] },
	foundationYear: { type: Number },
	hqAddress: addressSchema,
	website: linkSchemaType,
	description: { type: String },
	emails: [emailSchemaType],
	contactNumbers: [contactNumberSchemaType],
	admin: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Recruiter',
		required: [ true, 'Admin field is required' ]
	},
	recruiters: {
		type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter' }],
		required: [true, 'Recruiters field is required'],
		default: undefined
	}
}, { timestamps: true });

// Create the Mongoose model
export const Company = mongoose.model('Company', companySchema);