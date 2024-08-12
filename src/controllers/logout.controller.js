import AuthenticationService from "../services/authentication.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const logoutController = async (req, res, nex) => {
    AuthenticationService.logoutUser(req.cookies.refreshToken);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json(new ApiResponse(200, "Logged out"));
}

export { logoutController };