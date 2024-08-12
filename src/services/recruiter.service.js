import { ROLES } from '../constants.js';
import { Recruiter } from '../models/recruiter.model.js';

class RecruiterService {
    static role = ROLES.RECRUITER;
    
    /**
     * Finds an Recuiter in the DB with the given email.
     * @param {string} email - email of the required applicant
     * @returns {Promise<Document>} A Promise that resolves with the found document or null (in case of no match).
    */
    static async findByEmail(email) {
        return await Recruiter.findOne({ email: email });
    }
}

export default RecruiterService;
