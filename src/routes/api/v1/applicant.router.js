import express from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import { registerApplicantController, authenticateApplicantController } from '../../../controllers/applicant.controller.js';
import { validateNewPassword } from '../../../middlewares/validation.js';

const router = express.Router();
router.post('/register', validateNewPassword, asyncHandler(registerApplicantController));
router.post('/authenticate', asyncHandler(authenticateApplicantController));

export default router;