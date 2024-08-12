import bcrypt from 'bcrypt';
import { ApiError } from '../utils/ApiError.js';
import { PASSWORD_SALT_ROUNDS } from '../constants.js';
import ApplicantService from './applicant.service.js'
import RecruiterService from './recruiter.service.js'
import { Applicant } from "../models/applicant.model.js";
import { Recruiter } from "../models/recruiter.model.js";
import ValidationService from './validation.service.js';

class RegistrationService {
    static async #registerGeneralUser(userDetails, UserService, UserModel) {
        // Validate password first. 
        ValidationService.validatePassword(userDetails.password);
        // Also validate if password is strong enough
        ValidationService.validatePasswordStrength(userDetails.password);
        console.log('here');
        // Create a new User Document
        const newUser = new UserModel(userDetails);

        // Adding a mock hash field to allow validation
        newUser.hash = "x";

        // Validating Applicant details manually before doing anything expensive. All field in the Schema will be validated here
        await newUser.validate();

        // If given email is already registered
        if (await UserService.findByEmail(newUser.email))
            throw new ApiError(409, "Email already registered", { email: "Email already registered" });

        // Generating hash from password
        newUser.hash = await bcrypt.hash(userDetails.password, PASSWORD_SALT_ROUNDS);

        // Saving new applicant document to DB. Not validating before save as it was already done above.
        return await newUser.save({ validateBeforeSave: false });
    }

    static async registerApplicant(applicantDetails) {
        return await this.#registerGeneralUser(applicantDetails, ApplicantService, Applicant);
    }

    static async registerRecruiter(recruiterDetails) {
        return await this.#registerGeneralUser(recruiterDetails, RecruiterService, Recruiter);
    }
}

export default RegistrationService;