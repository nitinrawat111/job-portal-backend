import { Document } from 'mongoose';
import { Applicant } from '../models/applicant.model.js';
import { ROLES } from '../constants.js';
import UserService from './user.service.js';

class ApplicantService extends UserService {
    static Model = Applicant;
    static role = ROLES.APPLICANT;
}

export default ApplicantService;