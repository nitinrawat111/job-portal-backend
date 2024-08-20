import express from 'express';
import applicantRouter from './applicant.router.js';
import recruiterRouter from './recruiter.router.js';
import companyRouter from './company.router.js';
import jobRouter from './job.router.js';
import skillRouter from './skill.router.js'
import LogoutController from '../../../controllers/logout.controller.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';

const router = express.Router();
router.use('/applicants', applicantRouter);
router.use('/recruiters', recruiterRouter);
router.use('/companies', companyRouter);
router.use('/jobs', jobRouter);
router.use('/skills', skillRouter);
router.post('/logout', asyncHandler(LogoutController.logout));

export default router;