import mongoose from "mongoose";
import { emailSchemaType, contactNumberSchemaType, linkSchemaType } from "./common.schemaTypes.js";
import { addressSchema } from "./common.subSchemas.js";

// Education Subschema
const educationSchema = new mongoose.Schema({
	title: { type: String, required: [true, "Title is required"] },
	institution: { type: String, required: [true, "Institution is required"] },
	startYear: { type: Number, required: [true, "Start Year is required"] },
	endYear: {
		type: Number,
		validate: {
			validator: function (endYear) {
				if (this.isOngoing) {
					this.endYear = undefined;
					return true;
				}

				return endYear >= this.startYear;
			},
			message: "End Year cannot be before Start Year"
		}
	},
	expectedEndYear: {
		type: Number,
		validate: {
			validator: function (expectedEndYear) {
				if (!this.isOngoing) {
					this.expectedEndYear = undefined;
					return true;
				}

				return expectedEndYear >= startYear;
			},
			message: "Expected End Year cannot be before Start Year"
		}
	},
	isOngoing: { type: Boolean, required: [true, "isOngoing is required"] },
	obtainedGPA: { 
		type: Number,
		validate: {
			validator: function(obtainedGPA) {
				if(!this.maxGPA) {
					this.obtainedGPA = undefined;
					return true;
				}

				return obtainedGPA <= this.maxGPA;
			},
			message: "Obtained GPA cannot be greater than Max GPA"
		}
	},
	maxGPA: { 
		type: Number,
		validate: {
			validator: function(maxGPA) {
				if(!this.obtainedGPA) {
					this.obtainedGPA = undefined;
				}
				return true;
			}
		}
	}
}, { _id: false });

// Experience Subschema
const experienceSchema = new mongoose.Schema({
	designation: { type: String, required: [true, "Designation is required"] },
	organization: { type: String, required: [[true, "Organization is required"]] },
	location: { type: String },
	startDate: { type: Date, required: [true, "Start Date is required"] },
	endDate: { 
		type: Date,
		validate: {
			validator: function(endDate) {
				if(this.isOngoing) {
					this.endDate = undefined;
					return true;
				}

				return endDate >= this.startDate;
			},
			message: "End Date cannot be before Start Date"
		}
	},
	isOngoing: { type: Boolean, required: [true, "isOngoing is required"] },
	description: { type: String }
}, { _id: false });

// Project Subschema
const projectSchema = new mongoose.Schema({
	name: { type: String, required: [true, "Name is required"] },
	link: linkSchemaType,
	description: { type: String }
}, { _id: false });

// Certification Subschema
const certificationSchema = new mongoose.Schema({
	name: { type: String, required: [true, "Name is required"] },
	issuedBy: { type: String },
	issueDate: { 
		type: Date,
		validate: {
			validator: function(issueDate) {
				if(!this.expiryDate) {
					return true;
				}

				return issueDate <= this.expiryDate;
			},
			message: "Expiry Date cannot be before Issue Date"
		}
	},
	expiryDate: { 
		type: Date,
		validate: {
			validator: function(expiryDate) {
				if(!this.issueDate) {
					this.expiryDate = undefined;
				}
				return true;
			}
		}
	}
}, { _id: false });

// Link Subschema
const linkSchema = new mongoose.Schema({
	name: { type: String, required: [true, "Name is required"] },
	link: { ...linkSchemaType, required: [true, "Link is required"] }
}, { _id: false });

// Main Applicant Schema
const applicantSchema = new mongoose.Schema({
	email: { ...emailSchemaType, required: [true, "Email is required"] },
	hash: { type: String, required: [true, "Hash is required"] },
	name: { type: String, required: [true, "Name is required"] },
	contactNumbers: [contactNumberSchemaType],
	address: addressSchema,
	title: { type: String },
	bio: { type: String },
	educations: [educationSchema],
	experiences: [experienceSchema],
	skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
	projects: [projectSchema],
	certifications: [certificationSchema],
	links: [linkSchema],
	refreshTokens: [{ type: String }]
}, { timestamps: true });

// Creating unique Index on email field
applicantSchema.index({ email: 1 }, { unique: true });

export const Applicant = mongoose.model('Applicant', applicantSchema);