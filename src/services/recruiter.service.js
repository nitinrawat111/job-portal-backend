import { Recruiter } from '../models/recruiter.model.js';

const findRecruiter = async (email) => {
    return await Recruiter.findOne( { email: email} );
};

export { findRecruiter };
