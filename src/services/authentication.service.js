import bcrypt from 'bcrypt';
import { ApiError } from "../utils/ApiError.js";
import JWTService from './jwt.service.js';
import ValidationService from './validation.service.js';

class AuthenticationService {
    static async authenticateUser(email, password, UserService) {
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
        await UserService.Model.findByIdAndUpdate(
            foundUser._id,
            { $push : { refreshTokens: tokens.refreshToken } }
        );
        return tokens;
    }

    static async refreshUserAuthentication(incomingRefreshToken, UserService) {
        const decoded = JWTService.verifyRefreshToken(incomingRefreshToken);

        const foundUser = await UserService.Model.findOne(
            { _id: decoded.userDetails._id },
            { _id: 1, refreshTokens: 1 }
        ).lean().exec();
        if (!foundUser)
            throw new ApiError(401, "Unauthorized: User not found");

        // refreshTokens Array will never be undefined
        // Mongoose gives arrays the default value of []
        // So, it's guaranteed to be in the DB (unless Schema was changed!)
        const index = foundUser.refreshTokens.indexOf(incomingRefreshToken);
        if (index == -1) {
            // Refresh Token Reuse detected
            //Invalidating all refresh tokens to logout of all sessions
            await UserService.Model.findByIdAndUpdate(
                decoded.userDetails._id,
                {
                    $set : { refreshTokens: [] }
                }
            );
            throw new ApiError(401, "Unauthorized: Refresh Token reuse detected");
        }

        const tokens = JWTService.generateTokens(foundUser._id, UserService.role);
        await UserService.Model.findByIdAndUpdate(
            decoded.userDetails._id,
            {
                $pull: { refreshToken: incomingRefreshToken },
                $push: { refreshTokens: tokens.refreshToken }
            }
        );
        return tokens;
    }
}

export default AuthenticationService;