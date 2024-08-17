import ApplicantService from './applicant.service.js';
import RecruiterService from './recruiter.service.js';
import jwt from 'jsonwebtoken';
import { ROLES } from '../constants.js';

class LogoutService {
    static async logout(refreshToken) {
        let decoded = undefined;
        try {
            // Verify the refreshToken. 
            // Ignoring expiration as we need the payload (to remove the expired token from DB). 
            // If we don't ignore it, an error will be thrown for expired tokens
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
        // We don't need to check for existence of refreshToken in the DB
        // The below updateOne will remove the refreshToken only if it exists. Otherwise, no change is made
        await UserService.Model.updateOne(
            { _id: decoded.userDetails._id },
            { $pull: { refreshTokens: refreshToken } }
        );
    }
}

export default LogoutService;