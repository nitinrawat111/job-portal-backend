import bcrypt from 'bcrypt';
import { ApiError } from '../utils/ApiError.js';
import { PASSWORD_SALT_ROUNDS } from '../constants.js';
import ValidationService from './validation.service.js';

class RegistrationService {
    static async registerUser(newUserDetails, UserService) {
        // Validate password first. 
        ValidationService.validatePassword(newUserDetails.password);
        // Also validate if password is strong enough
        ValidationService.validatePasswordStrength(newUserDetails.password);

        // Create a new User Document
        const newUser = new UserService.Model(newUserDetails);

        // Adding a mock hash field to allow validation
        newUser.hash = "x";

        // Validating Applicant details manually before doing anything expensive. All field in the Schema will be validated here
        await newUser.validate();

        // If given email is already registered
        if (await UserService.findByEmail(newUser.email))
            throw new ApiError(409, "Email already registered", { email: "Email already registered" });

        // Generating hash from password
        newUser.hash = await bcrypt.hash(newUserDetails.password, PASSWORD_SALT_ROUNDS);

        // Saving new applicant document to DB. Not validating before save as it was already done above.
        await newUser.save({ validateBeforeSave: false });
    }
}

export default RegistrationService;