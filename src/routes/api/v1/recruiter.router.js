import express from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js'
import { validateNewPassword } from '../../../middlewares/validation.js';
import { registerRecruiterController, authenticateRecruiterController } from '../../../controllers/recruiter.controller.js';

const router  = express.Router();
router.post('/register', validateNewPassword, asyncHandler(registerRecruiterController));
router.post('/authenticate', asyncHandler(authenticateRecruiterController));

export default router;