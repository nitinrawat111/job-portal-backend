import CompanyService from "../services/company.service.js";
import { ApiResponse } from '../utils/ApiResponse.js';

class CompanyController {
    static async register(req, res, next) {
        await CompanyService.register(req.body, req.userDetails._id);
        return res.status(200).json(new ApiResponse(200, "Company Successfully registered"));
    }

    static async getById(req, res, next) {
        const company = await CompanyService.getById(req.params.id);
        return res.status(200).json(new ApiResponse(200, "Company details fetched successfully", { company: company }));
    }
}

export default CompanyController;