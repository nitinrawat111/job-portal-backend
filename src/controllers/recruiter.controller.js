import { ApiResponse } from "../utils/ApiResponse.js";
import RegistrationService from "../services/registration.service.js";
import AuthenticationService from "../services/authentication.service.js";
import { ACCESS_TOKEN_EXPIRATION_TIME, REFRESH_TOKEN_EXPIRATION_TIME } from "../constants.js";

const registerRecruiterController = async (req, res, next) => {
    await RegistrationService.registerRecruiter(req.body);
    return res.status(200).json(new ApiResponse(200, "Recruiter Successfully registered"));
}

const authenticateRecruiterController = async (req, res, next) => {
    const { accessToken, refreshToken } = await AuthenticationService.authenticateRecruiter(req.body.email, req.body.password);
    res.cookie('accessToken', accessToken, { maxAge: ACCESS_TOKEN_EXPIRATION_TIME });
    res.cookie('refreshToken', refreshToken, { maxAge: REFRESH_TOKEN_EXPIRATION_TIME });
    return res.status(200).json(new ApiResponse(200, "Successfully Authenticated as Recruiter"));
}

const refreshRecruiterAuthenticationController = async (req, res, next) => {
    const { accessToken, refreshToken } = await AuthenticationService.refreshRecruiterAuthentication(req.cookies.refreshToken);
    res.cookie('accessToken', accessToken, { maxAge: ACCESS_TOKEN_EXPIRATION_TIME });
    res.cookie('refreshToken', refreshToken, { maxAge: REFRESH_TOKEN_EXPIRATION_TIME });
    return res.status(200).json(new ApiResponse(200, "Successfully Refreshed Authentication"));
}

export { registerRecruiterController, authenticateRecruiterController, refreshRecruiterAuthenticationController };