import validator from "validator";
import { ApiError } from "../utils/ApiError.js";
import { isString } from "../utils/extras.js"

const validateEmail = (email) => {
    if(!email)
        throw new ApiError(400, 'Missing Email', { email: "Missing Email" });
    
    if(!isString(email))
        throw new ApiError(400, 'Invalid Email', { email: "Invalid Email (Should be a string)" });
}

const validatePassword = (password) => {
    if(!password)
        throw new ApiError(400, 'Missing Password', { password: "Missing Password" });

    if(!isString(password))
        throw new ApiError(400, 'Invalid Password', { password: "Invalid Password (Should be a string)" });
}

const validatePasswordStrength = (password) => {
    if(!validator.isStrongPassword(password))
        throw new Error(400, 'Weak Password', { password: "Password should contain uppercase letter, lowercase letter, digit and special charcters" });
}

export { validateEmail, validatePassword, validatePasswordStrength };