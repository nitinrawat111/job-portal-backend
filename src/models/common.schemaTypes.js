/**
 * This module contains some common SchemaTypes which are used in multiple Schemas
 * These are just JS objects which can be used directly while defining a Schema instead of specifying these common type configurations manually
 * For example: SchemaType for an email and link field can be used in this way
 * @example
 * const exampleSchema = new mongoose.Schema({
 * 		link: linkSchemType,
 * 		email: { ...emailSchemaType, required: true }		// We can also include additonal configs in this way
 * })
 * 
*/

import validator from "validator";

export const emailSchemaType = {
	type: String,
	validate: {
		validator: function(email) {
			return validator.isEmail(email);
		},
		message: "Invalid Email"
	}
};

export const contactNumberSchemaType = {
	type: String,
	validate: {
		validator: function(contactNumber) {
			return validator.isMobilePhone(contactNumber);
		},
		message: "Invalid Contact Number"
	}
};

export const linkSchemaType = { 
    type: String,
    validate: {
        validator: function(link) {
            return validator.isURL(link);
        },
        message: "Invalid Link"
    }
};

export const timestampSchemaType = {
    type: Date,
    default: Date.now,
    required: true
};