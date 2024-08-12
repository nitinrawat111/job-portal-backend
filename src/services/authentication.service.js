import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiError } from "../utils/ApiError.js";
import ApplicantService from './applicant.service.js';
import RecruiterService from './recruiter.service.js';
import { ACCESS_TOKEN_EXPIRATION_TIME, REFRESH_TOKEN_EXPIRATION_TIME } from "../constants.js";
import ValidationService from './validation.service.js';

class AuthenticationService {
    static async #generateJWT(userDocument, role) {
        const jwtPayload = {
            userDetails: {
                id: userDocument.id,
                email: userDocument.email,
                name: userDocument.name,
                role: role
            }
        };
        const accessToken = jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION_TIME });
        const refreshToken = jwt.sign(jwtPayload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION_TIME });

        userDocument.refreshTokens.push(refreshToken);
        await userDocument.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    }

    /**
     * Generates an function which can be used for Authentication of a given class of user (Applicant, Recuiter, etc.)
     * @param {string} findUserFunction - function that takes email as an parameter and returns the user document with given email.
     * @param {string} role - role of the user class
     * @returns {Promise<Document>} A function which can be used to authenticate a user of the specified user class
     * @example
     * // This return a function to authenticate an Applicant
     * const authenticateApplicant = getAuthenticationFunction( ApplicantService.findApplicant, ROLES.APPLICANT )
    */
    static async #authenticateGeneralUser(email, password, UserService) {
        ValidationService.validateEmail(email);
        ValidationService.validatePassword(password);

        const foundUser = await UserService.findByEmail(email);
        if (!foundUser)
            throw new ApiError(401, "Not Authorized", { email: "Given email does not exist" });

        const passwordMatch = await bcrypt.compare(password, foundUser.hash);
        if (!passwordMatch)
            throw new ApiError(401, "Not Authorized", { password: "Wrong password" });

        return await this.#generateJWT(foundUser, UserService.role);
    }

    static async authenticateApplicant(email, password) {
        return await this.#authenticateGeneralUser(email, password, ApplicantService);
    }

    static async authenticateRecruiter(email, password) {
        return await this.#authenticateGeneralUser(email, password, RecruiterService);
    }

    static async #refreshGeneralUserAuthentication(incomingRefreshToken, UserService) {
        if(!incomingRefreshToken)
            throw new ApiError(400, "Reresh Token not found");

        let decoded;
        try {
            decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        } catch (err) {
            // If token is tampered with or if token is expired
            throw new ApiError(401, "Unauthorized: Invalid Refresh Token");
        }

        const foundUser = await UserService.findByEmail(decoded.userDetails.email);
        if (!foundUser)
            throw new ApiError(401, "Unauthorized: User not found");

        const index = foundUser.refreshTokens.indexOf(incomingRefreshToken);
        if (index == -1) {
            // Refresh Token Reuse detected
            // Invalidating all refresh token to logout of all sessions
            foundUser.refreshTokens = [];
            await foundUser.save({ validateBeforeSave: false });
            throw new ApiError(401, "Unauthorized: Refresh Token reuse detected");
        }

        // Remove incomingRefreshToken from DB, Changes will be saved in the generateJWT function
        foundUser.refreshTokens.splice(index, 1);
        console.log(foundUser);
        return await this.#generateJWT(foundUser, UserService.role);
    }

    static async refreshApplicantAuthentication(incomingRefreshToken) {
        return await this.#refreshGeneralUserAuthentication(incomingRefreshToken, ApplicantService);
    }
    
    static async refreshRecruiterAuthentication(incomingRefreshToken) {
        return await this.#refreshGeneralUserAuthentication(incomingRefreshToken, RecruiterService);
    }
}

export default AuthenticationService;