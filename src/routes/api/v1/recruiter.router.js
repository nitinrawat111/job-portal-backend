import express from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js'
import { registerRecruiterController, authenticateRecruiterController, refreshRecruiterAuthenticationController } from '../../../controllers/recruiter.controller.js';

const router  = express.Router();
router.post('/register', asyncHandler(registerRecruiterController));
router.post('/authenticate', asyncHandler(authenticateRecruiterController));
router.post('/authenticate/refresh', asyncHandler(refreshRecruiterAuthenticationController));

export default router;