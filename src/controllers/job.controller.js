import JobService from '../services/job.service.js';
import { ApiResponse } from '../utils/ApiResponse.js';

class JobController {
    static async post(req, res, next) {
        await JobService.post(req.body, req.userDetails._id);
        return res.status(200).json(new ApiResponse(200, "Job posted successfully"));
    }
}

export default JobController;