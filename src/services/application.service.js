import mongoose from "mongoose";
import { Application } from "../models/application.model.js";
import { ApiError } from "../utils/ApiError.js";
import JobService from "./job.service.js";

class ApplicationService {
    static Model = Application;

    static async submitApplication(jobId, applicantId) {
        // Checking if given jobId is valid or not
        // Not checking applicantId assuming it is ontained after decoding a JWT token and hence authentic
        if (!mongoose.isValidObjectId(jobId))
            throw new ApiError(400, "Invalid job id");

        // Checking if job exists or not
        const job = await JobService.Model.findOne( { _id: jobId }, { _id: 1 }).lean().exec();
        if(!job)
            throw new ApiError(404, 'Job id not found');

        const newApplication = new this.Model({
            applicantId: applicantId,
            jobId: jobId
        });
        
        try {
            await newApplication.save();
        } catch(err) {
            if(err.code != 11000) // 11000 is the error code for Duplicate key error
            throw err;
            
            // We have a unique compound index on [ applicantId, jobId ]. So duplicate applications will be throw an error
            // If the combination of current [jobId, applicantId] already exists, it means user has already applied to the job before
            throw new ApiError(409, 'Already applied');
        }
    }
}

export default ApplicationService;