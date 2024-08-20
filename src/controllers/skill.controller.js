import SkillService from "../services/skill.service.js";
import { ApiResponse } from "../utils/ApiResponse.js";

class SkillController {
    static async add(req, res, next) {
        await SkillService.add(req.body);
        return res.status(200).json(new ApiResponse(200, 'Skill added successfully'));
    }
}

export default SkillController