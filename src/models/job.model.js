import mongoose from "mongoose";

const minMaxSchema = new mongoose.Schema({
	min: { 
		type: Number,
		required: true,
		validate: {
			validator: function(min) {
				if(!this.max) {
					this.min = undefined;
				}

				return true;
			}
		}
	},
	max: { 
		type: Number, 
		required: true,
		validate: {
			validator: function(max) {
				if(!this.min) {
					this.max = undefined;
					return true;
				}

				return max >= this.min;
			},
			message: "Max cannot be less than Min"
		}
	}
}, { _id: false });

const jobSchema = new mongoose.Schema({
	companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: [true, 'Company ID id required'] },
	recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recruiter', required: [true, 'Recruiter ID is required'] },
	title: { type: String, required: [true, 'Title is required'], trim: true },
	locations: {
		type: [{
			type: String,
			trim: true
		}],
		required: [true, 'Location(s) is(are) required'],
		default: undefined
	},
	description: { type: String, trim: true },
	showRecruiterInfo: { type: Boolean, required: [true, 'showRecruiterInfo is required'] },
	salary: minMaxSchema,
	experience: minMaxSchema,
	requiredSkills: [String],
}, { timestamps: true });

// Create the Mongoose model
export const Job = mongoose.model('Job', jobSchema);