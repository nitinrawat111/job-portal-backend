import { Skill } from "../models/skill.model.js";
import { ApiError } from "../utils/ApiError.js";

class SkillService {
    static Model = Skill;

    static async add(skillDetails) {
        const newSkill = new this.Model(skillDetails);
        try {
            await newSkill.save();
        } catch(err) {
            if(err.code != 11000)   // 11000 is the error code for Duplicate key error
                throw err;

            // We have a unique index on name field. So inserting duplicate skills will be throw an duplicate key error error
            throw new ApiError(409, 'Skill already exists');
        }
    }
}

export default SkillService;