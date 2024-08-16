import mongoose from "mongoose";

// Salary Subschema
const salarySchema = new mongoose.Schema({
	min: { type: Number, required: true },
	max: { 
		type: Number, 
		required: true,
		validate: {
			validator: function(maxSalary) {
				return maxSalary >= this.minSalary;
			},
			message: "Max Salary cannot be less than Min Salary"
		}
	}
}, { _id: false });

const jobSchema = new mongoose.Schema({
	companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
	recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: true },
	title: { type: String, required: true },
	locations: {
		type: [String],
		required: true,
		default: undefined
	},
	description: { type: String },
	showRecruiterInfo: { type: Boolean, required: true },
	salary: salarySchema,
	requiredSkills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }], // Assuming 'Skill' is the related Mongoose model
}, { timestamps: true });

// Create the Mongoose model
export const Job = mongoose.model('Job', jobSchema);