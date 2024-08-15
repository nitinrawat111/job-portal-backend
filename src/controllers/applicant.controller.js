import { ApiResponse } from '../utils/ApiResponse.js';
import { ACCESS_TOKEN_EXPIRATION_TIME, REFRESH_TOKEN_EXPIRATION_TIME } from '../constants.js';
import ApplicantService from '../services/applicant.service.js';

class ApplicantController {
    static async register (req, res, next) {
        await ApplicantService.register(req.body);
        return res.status(200).json(new ApiResponse(200, "Applicant successfully registered"));
    };
    
    static async authenticate (req, res, next) {
        const { accessToken, refreshToken } = await ApplicantService.authenticate(req.body.email, req.body.password);
        res.cookie('accessToken', accessToken, { maxAge: ACCESS_TOKEN_EXPIRATION_TIME });
        res.cookie('refreshToken', refreshToken, { maxAge: REFRESH_TOKEN_EXPIRATION_TIME });
        return res.status(200).json(new ApiResponse(200, "Succesfully Authenticated as Applicant"));
    }
    
    static async refreshAuthentication (req, res, next) {
        const { accessToken, refreshToken } = await ApplicantService.refreshAuthentication(req.cookies.refreshToken);
        res.cookie('accessToken', accessToken, { maxAge: ACCESS_TOKEN_EXPIRATION_TIME });
        res.cookie('refreshToken', refreshToken, { maxAge: REFRESH_TOKEN_EXPIRATION_TIME });
        return res.status(200).json(new ApiResponse(200, "Succesfully Refreshed Authentication"));
    }
}

export default ApplicantController;