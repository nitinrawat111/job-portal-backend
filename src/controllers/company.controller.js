import CompanyService from "../services/company.service.js";
import { ApiResponse } from '../utils/ApiResponse.js';

class CompanyController {
    static async register(req, res, next) {
        await CompanyService.register(req.body, req.userDetails._id);
        res.status(200).json(new ApiResponse(200, "Company Successfully registered"));
    }
}

export default CompanyController;