import { Document } from 'mongoose';
import { Applicant } from '../models/applicant.model.js';

/**
 * Finds an Applicant in the DB with the given email.
 * @param {string} email - email of the required applicant
 * @returns {Promise<Document>} A Promise that resolves with the found document or null (in case of no match).
*/
const findApplicant = async (email) => {
    return await Applicant.findOne({ email: email }).exec();
};

export { findApplicant };

/**
 * Validates given Applicant Details and registers the Applicant into DB (if not already present)
 * * This function only inserts those fields into DB which are defined in the Applicant Schema. Additonal fields are ignored.
 * @param {object} applicantDetails - an object containing details of new Applicant.
 * @returns {Promise<Document>} A Promise that resolves with the the inserted Applicant document.
//  */
// const registerApplicant = async (applicantDetails) => {
//     // Create a new Applicant Document
//     const newApplicant = new Applicant(applicantDetails);
    
//     // Adding a mock hash field to allow validation
//     newApplicant.hash = "x";
    
//     // Validating Applicant details manually before doing anything expensive
//     await newApplicant.validate();
    
//     // If given email is already registered
//     if(await findApplicant(newApplicant.email))
//         throw new ApiError(409, "Email already registered", { email: "Email already registered" });
    
//     // Generating hash from password
//     newApplicant.hash = await bcrypt.hash(applicantDetails.password, PASSWORD_SALT_ROUNDS);

//     // Saving new applicant document to DB. Not validating before save as it was already done above.
//     return await newApplicant.save( { validateBeforeSave: false } );
// };

// export { findApplicant, registerApplicant };