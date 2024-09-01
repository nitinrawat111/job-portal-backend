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
    };

    static companyAndRecruiterLookupStages = [
        {
            $lookup: {
                from: 'companies',
                let: { currCompanyId: "$companyId" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$_id', '$$currCompanyId']
                            }
                        }
                    },
                    { $limit: 1 },
                    {
                        $project: {
                            _id: 1,
                            name: 1
                        }
                    }
                ],
                as: 'company'
            }
        },
        {
            $lookup: {
                from: 'recruiters',
                let: { currRecruiterId: '$recruiterId' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $eq: ['$_id', '$$currRecruiterId']
                            }
                        },
                    },
                    { $limit: 1 },
                    {
                        $project: {
                            _id: 1,
                            name: 1
                        }
                    }
                ],
                as: 'recruiter'
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
                minExperience: 1,
                maxExperience: 1,
                requiredSkills: 1,
                company: { $first: '$company' },
                recruiter: {
                    $cond: [
                        { $eq: ['$showRecruiterInfo', true] },
                        { $first: '$recruiter' },
                        '$$REMOVE'
                    ]
                },
                createdAt: 1,
            }
        }
    ];

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
            ...this.companyAndRecruiterLookupStages
        ]).exec())[0];  // [0] because aggregation returns an array. We need the first and only document

        if (!job)
            throw new ApiError(404, "Job id not found");

        return job;
    }

    static async getJobs(applicantId, queryParams) {
        const pipeline = Job.aggregate();

        const searchQueryPresent = queryParams.q || queryParams.skill || queryParams.location;
        if (searchQueryPresent) {
            const searchStage = {
                index: "jobSearchIndex",
                compound: {
                    filter: [],
                    must: [],
                    should: []
                }
            };

            if (queryParams.q) {
                searchStage.compound.must.push({
                    text: {
                        query: queryParams.q,
                        path: ['title', 'description', 'requiredSkills', 'locations'],
                        fuzzy: {}
                    }
                });
            }

            if (queryParams.skill) {
                searchStage.compound.should.push({
                    text: {
                        query: queryParams.skill,
                        path: 'requiredSkills',
                        fuzzy: {}
                    }
                });
            }

            if (queryParams.location) {
                searchStage.compound.filter.push({
                    text: {
                        query: queryParams.location,
                        path: 'locations',
                        fuzzy: {}
                    }
                });
            }

            if (queryParams.sortBy === 'latest') {
                searchStage.sort = { _id: -1 };
            } else {
                searchStage.sort = {
                    score: { $meta: "searchScore" },
                    _id: -1
                };
            }

            if(queryParams.lastPaginationToken) {
                searchStage.searchAfter = queryParams.lastPaginationToken;
            }
            
            pipeline.append({ $search: searchStage });
        }

        const matchStage = {};
        if (queryParams.minExperience) {
            matchStage["experience.min"] = { $gte: queryParams.minExperience };
        }
        if (queryParams.maxExperience) {
            matchStage["experience.max"] = { $lte: queryParams.maxExperience };
        }
        if (queryParams.minSalary) {
            matchStage["salary.min"] = { $gte: queryParams.minSalary };
        }
        if (queryParams.maxSalary) {
            matchStage["salary.max"] = { $lte: queryParams.maxSalary };
        }
        pipeline.append({ $match: matchStage });

        let paginationToken;
        if (!searchQueryPresent) {
            if(queryParams.lastPaginationToken) {
                pipeline.append({ 
                    $match: { 
                        _id: { $lt: mongoose.Types.ObjectId.createFromHexString(queryParams.lastPaginationToken) }
                    } 
                });
            }
            pipeline.append({ $sort: { _id: -1 } });
            paginationToken = '$_id';
        } else {
            paginationToken = { $meta: "searchSequenceToken" };
        }

        const notAppliedJobsLookupStage = {
            from: "applications",
            let: { currJobId: "$_id" },
            pipeline: [
                {
                    $match: {
                        applicantId: mongoose.Types.ObjectId.createFromHexString(applicantId),
                        $expr: {
                            $eq: ['$jobId', '$$currJobId']
                        }
                    }
                },
                { $limit: 1 },
                { $project: { _id: 1 } }
            ],
            as: "applications"
        };
        pipeline.append([
            { $lookup: notAppliedJobsLookupStage },
            { $match: { applications: [] } },
            { $limit: 10 },
            ...this.companyAndRecruiterLookupStages,
            { $addFields: { paginationToken: paginationToken } }
        ]);

        return await pipeline.exec();
    }
}

export default JobService;