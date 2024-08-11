import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
	postId: { type: mongoose.Schema.Types.ObjectId, ref: 'JobPost', required: [true, "Server Error: Post ID is required"] },
	applicantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Applicant', required: [true, "Server Error: Applicant ID is required"] },
	status: { type: String, required: [true, "Server Error: Status is required"] },
	timestamp: { type: Date, default: Date.now, required: [true, "Server Error: Timestamp is required"] }
});

// Create the Mongoose model
export const Application = mongoose.model('Application', applicationSchema);