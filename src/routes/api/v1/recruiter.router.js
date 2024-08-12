import express from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js'
import { registerRecruiterController, authenticateRecruiterController } from '../../../controllers/recruiter.controller.js';

const router  = express.Router();
router.post('/register', asyncHandler(registerRecruiterController));
router.post('/authenticate', asyncHandler(authenticateRecruiterController));

export default router;