import mongoose from "mongoose";
import { Job } from "../models/job.model.js";
import { ApiError } from "../utils/ApiError.js";
import CompanyService from "./company.service.js";
import SanitizationService from "./sanitization.service.js";

class JobService {
    static Model = Job;
    static safeProjection = {
        companyId: 0,
        recruiterId: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0,
    }

    static async post(newJobDetails, recruiterId) {
        // Sanitize sensitive fields
        // 'recruiterId' field is set below. No need to sanitize it
        SanitizationService.getSanitizer('_id', 'createdAt', 'updatedAt', '__v')(newJobDetails);

        if (!newJobDetails.companyId)
            throw new ApiError(400, "companyId is required", { companyId: "companyId is required" });

        const matchedCompany = await CompanyService.Model.findOne(
            {
                _id: newJobDetails.companyId,
            },
            {
                _id: 1,
                // Instead of including entire recruiters array, including provided recruiterId (it it exists in array)
                // This 'recruiters' field will only be included in the result if it contains the given recruiterId
                recruiters: { $elemMatch: { $eq: recruiterId } }
            }
        ).lean().exec();

        if (!matchedCompany)
            throw new ApiError(404, "Given companyId not found", { companyId: "Given companyId not found" });

        // If recruiters field in not in returned document
        // It means that the recuiters array of the given company did not contain the provided recruiterId
        if (!matchedCompany.recruiters)
            throw new ApiError(403, "Forbidden: You are not authorized to post jobs for this company");

        const newJob = new this.Model(newJobDetails);
        newJob.recruiterId = recruiterId;
        await newJob.save();
    }

    static async getById(_id) {
        if (!mongoose.isValidObjectId(_id))
            throw new ApiError(400, "Invalid job id");

        const job = (await this.Model.aggregate([
            {
                $match: {
                    // Default _id is created from hex string in MongoDB. Also mongoose.Types.ObjectId is deprecated
                    _id: mongoose.Types.ObjectId.createFromHexString(_id)
                }
            },
            {
                $lookup: {
                    from: 'companies',
                    localField: 'companyId',
                    foreignField: '_id',
                    as: 'company'
                }
            },
            {
                $lookup: {
                    from: 'recruiters',
                    localField: 'recruiterId',
                    foreignField: '_id',
                    as: 'recruiter'
                }
            },
            {
                $unwind: '$company'
            },
            {
                $unwind: '$recruiter'
            },
            {
                $lookup: {
                    from: 'skills',
                    localField: 'requiredSkills',
                    foreignField: '_id',
                    as: 'requiredSkills'
                }
            },
            {
                $addFields: {
                    requiredSkills: '$requiredSkills.name'
                }
            },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    locations: 1,
                    description: 1,
                    showRecruiterInfo: 1,
                    salary: 1,
                    requiredSkills: 1,
                    'company._id': 1,
                    'company.name': 1,
                    'recruiter._id': 1,
                    'recruiter.name': 1,
                    createdAt: 1,
                }
            }
        ]).exec())[0];  // [0] because aggregation returns an array. We need the first and only document

        if (!job)
            throw new ApiError(404, "Job id not found");

        if(!job.showRecruiterInfo) {
            job.recruiter = undefined;
            job.showRecruiterInfo = undefined;
        }

        return job;
    }
}

export default JobService;