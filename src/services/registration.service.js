import bcrypt from 'bcrypt';
import { ApiError } from '../utils/ApiError.js';
import { PASSWORD_SALT_ROUNDS } from '../constants.js';
import ValidationService from './validation.service.js';
import SanitizationService from './sanitization.service.js';

class RegistrationService {
    static async register(newUserDetails, UserService) {
        // Remove sensitive fields
        SanitizationService.removeFields(newUserDetails, '_id', 'hash', 'refreshTokens', 'createdAt', 'updatedAt', '__v');
        
        // Validate password first. 
        ValidationService.validatePassword(newUserDetails.password);
        // Also validate if password is strong enough
        ValidationService.validatePasswordStrength(newUserDetails.password);

        // Create a new User Document
        const newUser = new UserService.Model(newUserDetails);
        newUser.hash = await bcrypt.hash(newUserDetails.password, PASSWORD_SALT_ROUNDS);

        try {
            // Validate user details and save the user
            await newUser.save();
        } catch(err) {
            if(err.code != 11000)   // 11000 is the error code for Duplicate key error
                throw err;
            
            // We have a unique index on email field. So inserting user with existing email will be throw an duplicate key error
            throw new ApiError(409, "Email already registered", { email: "Email already registered" });
        }
    }
}

export default RegistrationService;