import ApplicantService from './applicant.service.js';
import RecruiterService from './recruiter.service.js';
import jwt from 'jsonwebtoken';
import { ROLES } from '../constants.js';

class LogoutService {
    static async logout(refreshToken) {
        let decoded = undefined;
        try {
            // Verify the refreshToken. 
            // Ignoring expiration as we want payload to remove the expired token from DB. 
            // If we don't ignore it and error will be thrown for expired tokens
            decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, { ignoreExpiration: true });
        } catch (err) {
            // If token was tampered with. We can't do anything :)
            return;
        }

        /////////////////////////////////////////////////////////////////////////
        // If the token is valid (unexpired or expired), use the decoded payload to remove it from DB
        /////////////////////////////////////////////////////////////////////////
        
        // Decide which service to use based on user role
        const UserService = decoded.userDetails.role == ROLES.APPLICANT ? ApplicantService : RecruiterService;

        // Remove the refresh token from DB (if it exists)
        await UserService.Model.updateOne(
            { _id: decoded.userDetails._id, refreshTokens: refreshToken },
            { $pull: { refreshTokens: refreshToken } }
        );
    }
}

export default LogoutService;