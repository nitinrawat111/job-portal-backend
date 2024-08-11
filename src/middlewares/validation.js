import validator from "validator"
import { ApiError } from "../utils/ApiError.js";
import { isString } from "../utils/extras.js";

export const validateNewPassword = (req, res, next) => {
    const password = req.body.password;
    
    // If password is not there (or something falsy)
    if(!password)
        throw new ApiError(400, "Password is required", { password: "Password is required" });
    
    // If password is not a string or password is weak.
    if(!isString(password))
        throw new ApiError(400, "Password should be a string", { password: "Password should be a string" });
        
    // Make sure password is String before this point. validator throws an error in case of non-string values
    // If password in not strong
    if(!validator.isStrongPassword(password))
        throw new ApiError(400, "Password Should contain minimum of 8 chracters (including uppercase letters, lowercase letters, numbers and symbols)", { password: "Strong password is required"});
 
    next();
}