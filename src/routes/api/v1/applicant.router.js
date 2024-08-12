import express from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { registerApplicantController, authenticateApplicantController, refreshApplicantAuthenticationController } from '../../../controllers/applicant.controller.js';

const router = express.Router();
router.post('/register', asyncHandler(registerApplicantController));
router.post('/authenticate', asyncHandler(authenticateApplicantController));
router.post('/authenticate/refresh', asyncHandler(refreshApplicantAuthenticationController));

export default router;