import bcrypt from 'bcrypt';
import { ApiError } from "../utils/ApiError.js";
import JWTService from './jwt.service.js';
import ValidationService from './validation.service.js';

class AuthenticationService {
    static async authenticateUser(email, password, UserService) {
        ValidationService.validateEmail(email);
        ValidationService.validatePassword(password);

        const foundUser = await UserService.findByEmail(email, { _id: 1, hash: 1, refreshTokens: 1 });
        if (!foundUser)
            throw new ApiError(401, "Not Authorized", { email: "Given email does not exist" });

        const passwordMatch = await bcrypt.compare(password, foundUser.hash);
        if (!passwordMatch)
            throw new ApiError(401, "Not Authorized", { password: "Wrong password" });

        const tokens = JWTService.generateTokens(foundUser._id, UserService.role);
        await UserService.addRefreshTokenAndSave(foundUser, tokens.refreshToken);
        return tokens;
    }

    static async refreshUserAuthentication(incomingRefreshToken, UserService) {
        const decoded = JWTService.verifyRefreshToken(incomingRefreshToken);
        
        // Checking for if the refresh token is used for rightful user role
        // Removing this will allow one to refresh authentication using tokens for another role (however, there is less than one in billion-billion chance for that)
        if(decoded.userDetails.role != UserService.role) 
            throw new ApiError(403, "Forbidden");

        const foundUser = await UserService.findById(decoded.userDetails._id, { _id: 1, refreshTokens: 1 });
        if (!foundUser)
            throw new ApiError(401, "Unauthorized: User not found");

        const index = foundUser.refreshTokens.indexOf(incomingRefreshToken);
        if (index == -1) {
            // Refresh Token Reuse detected. Invalidating all refresh tokens to logout of all sessions
            await UserService.clearRefreshTokensAndSave(foundUser);
            throw new ApiError(401, "Unauthorized: Refresh Token reuse detected");
        }

        // Remove incomingRefreshToken
        foundUser.refreshTokens.splice(index, 1);
        const tokens = JWTService.generateTokens(foundUser._id, UserService.role);
        await UserService.addRefreshTokenAndSave(foundUser, tokens.refreshToken);
        return tokens;
    }

    
}

export default AuthenticationService;