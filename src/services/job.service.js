import { Job } from "../models/job.model.js";
import { ApiError } from "../utils/ApiError.js";
import CompanyService from "./company.service.js";

class JobService {
    static Model = Job;
    
    static async post(newJobDetails, recruiterId) {
        if(!newJobDetails.companyId)
            throw new ApiError(400, "companyId is required", { companyId: "companyId is required" });

        const matchedCompany = await CompanyService.Model.findOne(
            {
                _id: newJobDetails.companyId,
            },
            {
                _id: 1,
                // Instead of including entire recruiters array, including provided recruiterId (it it exists in array)
                // This 'recruiters' field will only be included in the result if it contains the given recruiterId
                recruiters: { $elemMatch : { $eq: recruiterId } }   
            }
        ).lean().exec();

        if(!matchedCompany)
            throw new ApiError(404, "Given companyId not found", { companyId: "Given companyId not found" });

        // If recruiters field in not in returned document
        // It means that the recuiters array of the given company did not contain the provided recruiterId
        if(!matchedCompany.recruiters)
            throw new ApiError(403, "Forbidden: You are not authorized to post jobs for this company");

        newJobDetails.recruiterId = recruiterId;
        const newJob = new this.Model(newJobDetails);
        await newJob.save();
    }
}

export default JobService;