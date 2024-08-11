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