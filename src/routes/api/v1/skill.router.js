import express from 'express';
import { verifyJWT } from '../../../middlewares/verifyJWT.middleware.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import SkillController from '../../../controllers/skill.controller.js';

const router = express.Router();
router.post('/', verifyJWT, asyncHandler(SkillController.add));

export default router;