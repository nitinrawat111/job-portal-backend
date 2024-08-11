import bcrypt from 'bcrypt';
import { ApiError } from '../utils/ApiError.js';
import { PASSWORD_SALT_ROUNDS } from '../constants.js';
import * as ApplicantService from './applicant.service.js'
import * as RecruiterService from './recruiter.service.js'
import { Applicant } from "../models/applicant.model.js";
import { Recruiter } from "../models/recruiter.model.js";

/**
 * Generates an function which can be used for Registration of a given class of user (Applicant, Recuiter, etc.)
 * @param {string} UserModel - Model representing the user class
 * @param {string} findUserFunction - function that takes email as an parameter and returns the user document with given email.
 * @returns {Promise<Document>} A function which can be used to register a new user of the specified user class
 * @example
 * // This return a function to authenticate an Applicant
 * const registerApplicant = getRegistrationFunction( Applicant, ApplicantService.findApplicant)
*/
const getRegistrationFunction = (UserModel, findUserFunction) => {
    return async (userDetails) => {
        // Create a new Applicant Document
        const newUser = new UserModel(userDetails);

        // Adding a mock hash field to allow validation
        newUser.hash = "x";

        // Validating Applicant details manually before doing anything expensive
        await newUser.validate();

        // If given email is already registered
        if (await findUserFunction(newUser.email))
            throw new ApiError(409, "Email already registered", { email: "Email already registered" });

        // Generating hash from password
        newUser.hash = await bcrypt.hash(userDetails.password, PASSWORD_SALT_ROUNDS);

        // Saving new applicant document to DB. Not validating before save as it was already done above.
        return await newUser.save({ validateBeforeSave: false });
    }
}

// Function to register an Applicant
const registerApplicant = getRegistrationFunction( Applicant, ApplicantService.findApplicant);
// Function to register an Recruiter
const registerRecruiter = getRegistrationFunction( Recruiter, RecruiterService.findRecruiter);

export { registerApplicant, registerRecruiter };