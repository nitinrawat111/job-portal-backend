import { Applicant } from '../models/applicant.model.js';
import { ROLES } from '../constants.js';
import UserService from './user.service.js';
import { Skill } from '../models/skill.model.js';
import mongoose from 'mongoose'


class ApplicantService extends UserService {
    static Model = Applicant;
    static role = ROLES.APPLICANT;

    static async getProfile(_id) {
        // return await this.Model.
        //     findOne( 
        //         { _id: _id },
        //         { 
        //             _id: 0,
        //             hash: 0,
        //             refreshTokens: 0,
        //             createdAt: 0,
        //             updatedAt: 0,
        //             __v: 0
        //         }
        //     )
        //     .lean()
        //     .populate('skills', { _id: 0 })
        //     .exec();

        // This Aggregation is faster than above population method (manually tested)
        return (await this.Model.aggregate([
            {
                $match: {
                    // Default _id is created from hex string in MongoDB. Also mongoose.Types.ObjectId is deprecated
                    _id: mongoose.Types.ObjectId.createFromHexString(_id)
                }
            },
            {
                $lookup: {
                    from: 'skills',
                    localField: 'skills',
                    foreignField: '_id',
                    as: 'skills'
                }
            },
            {
                $addFields: {
                    skills: '$skills.name'
                }
            },
            {
                $project: this.safeProjection
            }
        ]).exec())[0];  // [0] because aggregation returns an array. We need the first and only document
    }
}

export default ApplicantService;