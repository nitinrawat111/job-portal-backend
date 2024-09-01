import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
	jobId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPost', required: [true, "Job ID is required"] },
	applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Applicant', required: [true, "Applicant ID is required"] },
	status: {
		type: String,
		enum: ['Submitted', 'Viewed', 'Rejected', 'Selected'],
		default: 'Submitted',
		required: [true, "Status is required"]
	}
}, { timestamps: true });

applicationSchema.index({ applicantId: 1, jobId: 1 }, { unique: true });
applicationSchema.index({ jobId: 1 });

// Create the Mongoose model
export const Application = mongoose.model('Application', applicationSchema);