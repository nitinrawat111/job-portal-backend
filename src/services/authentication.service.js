import bcrypt from 'bcrypt';
import { ApiError } from "../utils/ApiError.js";
import JWTService from './jwt.service.js';
import ValidationService from './validation.service.js';

class AuthenticationService {
    static async authenticate(email, password, UserService) {
        ValidationService.validateEmail(email);
        ValidationService.validatePassword(password);

        const foundUser = await UserService.Model.findOne(
            { email: email },
            { _id: 1, hash: 1 }
        ).lean().exec();
        if (!foundUser)
            throw new ApiError(401, "Not Authorized", { email: "Given email does not exist" });

        const passwordMatch = await bcrypt.compare(password, foundUser.hash);
        if (!passwordMatch)
            throw new ApiError(401, "Not Authorized", { password: "Wrong password" });

        const tokens = JWTService.generateTokens(foundUser._id, UserService.role);
        await UserService.Model.updateOne(
            { _id: foundUser._id },
            { $push : { refreshTokens: tokens.refreshToken } }
        );
        return tokens;
    }

    static async refreshAuthentication(incomingRefreshToken, UserService) {
        const decoded = JWTService.verifyRefreshToken(incomingRefreshToken);

        const foundUser = await UserService.Model.findOne(
            { _id: decoded.userDetails._id },
            { _id: 0, refreshTokens: 1 }
        ).lean().exec();

        if (!foundUser)
            throw new ApiError(401, "Unauthorized: User not found");
            
        // If given token is not found in DB
        if(!foundUser.refreshTokens.includes(incomingRefreshToken)) {
            // Refresh Token Reuse detected
            // Invalidating all refresh tokens to logout of all sessions
            await UserService.Model.updateOne(
                { _id: decoded.userDetails._id },
                { $set : { refreshTokens: [] } }
            );
            throw new ApiError(401, "Unauthorized: Refresh Token reuse detected");
        }

        const tokens = JWTService.generateTokens(decoded.userDetails._id, UserService.role);
        await Promise.all([
            // Removing the old refresh token from DB  
            // These two operations cannot be done in a single updateOne query as they both modify the same field.
            UserService.Model.updateOne(
                { _id: decoded.userDetails._id },
                { $pull: { refreshTokens: incomingRefreshToken } }
            ),
            // Inserting the new refresh token into DB  
            UserService.Model.updateOne(
                { _id: decoded.userDetails._id },
                { $push: { refreshTokens: tokens.refreshToken } }
            )
        ]);
        return tokens;
    }
}

export default AuthenticationService;