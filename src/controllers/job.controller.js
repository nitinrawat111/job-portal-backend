import ApplicationService from '../services/application.service.js';
import JobService from '../services/job.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

class JobController {
    static async post(req, res, next) {
        await JobService.post(req.body, req.userDetails._id);
        return res.status(200).json(new ApiResponse(200, "Job posted successfully"));
    }

    static async getById(req, res, next) {
        const job = await JobService.getById(req.params.id);
        return res.status(200).json(new ApiResponse(200, "Job details fetched successfully", { job: job }));
    }

    static async submitApplication(req, res, next) {
        await ApplicationService.submitApplication(req.params.id, req.userDetails._id);
        return res.status(200).json(new ApiResponse(200, 'Applied successfully'));
    }

    static async getJobs(req, res, next) {
        const jobs = await JobService.getJobs(req.userDetails._id, req.query);
        return res.status(200).json(new ApiResponse(200, "Jobs fetched successfully", { jobs: jobs }));
    }
}

export default JobController;