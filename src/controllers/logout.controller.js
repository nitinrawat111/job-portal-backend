import LogoutService from "../services/logout.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

class LogoutController {
    static async logout (req, res, nex) {
        LogoutService.logout(req.cookies.refreshToken);
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        return res.status(200).json(new ApiResponse(200, "Logged out"));
    }
}

export default LogoutController;