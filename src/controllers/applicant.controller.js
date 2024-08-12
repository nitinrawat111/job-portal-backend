import { ApiResponse } from '../utils/ApiResponse.js';
import RegistrationService from '../services/registration.service.js';
import AuthenticationService from '../services/authentication.service.js';
import { ACCESS_TOKEN_EXPIRATION_TIME, REFRESH_TOKEN_EXPIRATION_TIME } from '../constants.js';

const registerApplicantController = async (req, res, next) => {
    await RegistrationService.registerApplicant(req.body);
    return res.status(200).json(new ApiResponse(200, "Applicant successfully registered"));
};

const authenticateApplicantController = async (req, res, next) => {
    const { accessToken, refreshToken } = await AuthenticationService.authenticateApplicant(req.body.email, req.body.password);
    res.cookie('accessToken', accessToken, { maxAge: ACCESS_TOKEN_EXPIRATION_TIME });
    res.cookie('refreshToken', refreshToken, { maxAge: REFRESH_TOKEN_EXPIRATION_TIME });
    return res.status(200).json(new ApiResponse(200, "Succesfully Authenticated as Applicant"));
}

const refreshApplicantAuthenticationController = async (req, res, next) => {
    const { accessToken, refreshToken } = await AuthenticationService.refreshApplicantAuthentication(req.cookies.refreshToken);
    res.cookie('accessToken', accessToken, { maxAge: ACCESS_TOKEN_EXPIRATION_TIME });
    res.cookie('refreshToken', refreshToken, { maxAge: REFRESH_TOKEN_EXPIRATION_TIME });
    return res.status(200).json(new ApiResponse(200, "Succesfully Refreshed Authentication"));
}

export { registerApplicantController, authenticateApplicantController, refreshApplicantAuthenticationController };