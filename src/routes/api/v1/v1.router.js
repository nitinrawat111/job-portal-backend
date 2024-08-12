import express from 'express';
import applicantRouter from './applicant.router.js';
import recruiterRouter from './recruiter.router.js';
import { logoutController } from '../../../controllers/logout.controller.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';

const router = express.Router();
router.use('/applicants', applicantRouter);
router.use('/recruiters', recruiterRouter);
router.post('/logout', asyncHandler(logoutController));

export default router;