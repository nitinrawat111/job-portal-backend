import { ROLES } from '../constants.js';
import { Recruiter } from '../models/recruiter.model.js';
import UserService from './user.service.js';

class RecruiterService extends UserService {
    static Model = Recruiter;
    static role = ROLES.RECRUITER;

    static async getProfile(_id) {
        return await this.Model.findOne(
            {
                _id: _id
            },
            this.safeProjection
        ).exec();
    }
}

export default RecruiterService;