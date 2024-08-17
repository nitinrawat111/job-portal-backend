import jwt from 'jsonwebtoken';
import { ACCESS_TOKEN_EXPIRATION_TIME, REFRESH_TOKEN_EXPIRATION_TIME } from '../constants.js';
import { ApiError } from '../utils/ApiError.js';

class JWTService {
    static generateTokens(userId, userRole) {
        const jwtPayload = {
            userDetails: {
                _id: userId,
                role: userRole
            }
        };
        const accessToken = jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION_TIME });
        const refreshToken = jwt.sign(jwtPayload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION_TIME });
        return { accessToken, refreshToken };
    }

    static verifyAccessToken(token) {
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        } catch (err) {
            throw new ApiError(401, "Unauthorized: Missing or Invalid Access Token");
        }

        return decoded;
    }

    static verifyRefreshToken(token) {
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
        } catch (err) {
            throw new ApiError(401, "Unauthorized: Missing or Invalid Refresh Token");
        }

        return decoded;
    }
}

export default JWTService;