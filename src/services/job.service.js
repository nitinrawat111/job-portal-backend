import { Job } from "../models/job.model.js";
import { ApiError } from "../utils/ApiError.js";
import CompanyService from "./company.service.js";

class JobService {
    static Model = Job;
    
    static async post(newJobDetails, recruiterId) {
        if(!newJobDetails.companyId)
            throw new ApiError(401, "companyId is required", { companyId: "companyId is required" });

        const matchedCompany = await CompanyService.Model.findOne(
            {
                _id: newJobDetails.companyId,
                recruiters: recruiterId
            },
            {
                _id: 1 // Retrieving only _id. Transmittin entire document will be costly
            }
        ).exec();

        if(!matchedCompany)
            throw new ApiError(401, "Either the given companyId does not exist or you are not authorised to Post Jobs for this company", { companyId: "Invalid or Forbidden" });

        const newJob = new this.Model(newJobDetails);
        newJob.recruiterId = recruiterId;
        await newJob.save();
    }
}

export default JobService;