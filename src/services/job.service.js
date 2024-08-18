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
                recruiters: { $elemMatch : { $eq: recruiterId } }
            }
        ).lean().exec();

        if(!matchedCompany)
            throw new ApiError(404, "Given companyId not found", { companyId: "Given companyId not found" });

        if(!matchedCompany.recruiters)
            throw new ApiError(403, "Forbidden: You are not authorized to post jobs for this company");

        newJobDetails.recruiterId = recruiterId;
        const newJob = new this.Model(newJobDetails);
        await newJob.save();
    }
}

export default JobService;