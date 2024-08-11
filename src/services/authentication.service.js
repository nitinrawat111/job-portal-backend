import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { ApiError } from "../utils/ApiError.js";
import * as ApplicantService from './applicant.service.js';
import * as RecruiterService from './recruiter.service.js';
import { ROLES, ACCESS_TOKEN_EXPIRATION_TIME, REFRESH_TOKEN_EXPIRATION_TIME } from "../constants.js";

/**
 * Generates an function which can be used for Authentication of a given class of user (Applicant, Recuiter, etc.)
 * @param {string} findUserFunction - function that takes email as an parameter and returns the user with given email.
 * @param {string} role - role of the user class
 * @returns {Promise<Document>} A function which can be used to authenticate any user of the specified user class
 * @example
 * // This return a function to authenticate an Applicant
 * const authenticateApplicant = getAuthenticator( ApplicantService.findApplicant, ROLES.APPLICANT )
*/
const getAuthenticator = (findUserFunction, role) => {
    return async (email, password) => {
        if(!email) 
            throw new ApiError(400, "Missing Credentials", { email: "Email is required" });
        
        if(!password) 
            throw new ApiError(400, "Missing Credentials", { password: "Password is required" });
        
        const foundUser = await findUserFunction(email);
        if (!foundUser)
            throw new ApiError(401, "Not Authorized", { email: "Given email does not exist" });

        const passwordMatch = await bcrypt.compare(password, foundUser.hash);
        if (!passwordMatch)
            throw new ApiError(401, "Not Authorized", { password: "Wrong password" });

        const jwtPayload = {
            userDetails: {
                id: foundUser.id,
                email: foundUser.email,
                name: foundUser.name,
                role: role
            }
        };
        const accessToken = jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION_TIME });
        const refreshToken = jwt.sign(jwtPayload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: REFRESH_TOKEN_EXPIRATION_TIME });

        foundUser.refreshTokens.push(refreshToken);
        await foundUser.save();

        return { accessToken, refreshToken };
    }
}

// Function to authenticate an applicant
export const authenticateApplicant = getAuthenticator(ApplicantService.findApplicant, ROLES.APPLICANT);
// Function to authenticate an Recruiter
export const authenticateRecruiter = getAuthenticator(RecruiterService.findRecruiter, ROLES.RECRUITER);