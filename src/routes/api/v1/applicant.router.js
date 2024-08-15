import express from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import ApplicantController from '../../../controllers/applicant.controller.js';

const router = express.Router();
router.post('/register', asyncHandler(ApplicantController.register));
router.post('/authenticate', asyncHandler(ApplicantController.authenticate));
router.post('/authenticate/refresh', asyncHandler(ApplicantController.refreshAuthentication));

export default router;