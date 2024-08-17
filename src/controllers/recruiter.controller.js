import { ApiResponse } from "../utils/ApiResponse.js";
import { ACCESS_TOKEN_EXPIRATION_TIME, REFRESH_TOKEN_EXPIRATION_TIME } from "../constants.js";
import RecruiterService from "../services/recruiter.service.js";

class RecruiterController {
    static async register (req, res, next) {
        await RecruiterService.register(req.body);
        return res.status(200).json(new ApiResponse(200, "Recruiter Successfully registered"));
    }
    
    static async authenticate (req, res, next) {
        const { accessToken, refreshToken } = await RecruiterService.authenticate(req.body.email, req.body.password);
        res.cookie('accessToken', accessToken, { maxAge: ACCESS_TOKEN_EXPIRATION_TIME });
        res.cookie('refreshToken', refreshToken, { maxAge: REFRESH_TOKEN_EXPIRATION_TIME });
        return res.status(200).json(new ApiResponse(200, "Successfully Authenticated as Recruiter"));
    }
    
    static async refreshAuthentication (req, res, next) {
        const { accessToken, refreshToken } = await RecruiterService.refreshAuthentication(req.cookies.refreshToken);
        res.cookie('accessToken', accessToken, { maxAge: ACCESS_TOKEN_EXPIRATION_TIME });
        res.cookie('refreshToken', refreshToken, { maxAge: REFRESH_TOKEN_EXPIRATION_TIME });
        return res.status(200).json(new ApiResponse(200, "Successfully Refreshed Authentication"));
    }

    static async getProfile (req, res, next) {
        const profile = await RecruiterService.getProfile(req.userDetails._id);
        return res.status(200).json(new ApiResponse(200, "Recruiter profile fetched successfully", { profile: profile }));
    }
}

export default RecruiterController;