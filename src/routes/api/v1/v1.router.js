import express from 'express';
import applicantRouter from './applicant.router.js';
import recruiterRouter from './recruiter.router.js';

const router = express.Router();
router.use('/applicants', applicantRouter);
router.use('/recruiters', recruiterRouter);

export default router;