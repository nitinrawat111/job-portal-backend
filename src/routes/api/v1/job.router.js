import express from 'express';
import { verifyJWT } from '../../../middlewares/verifyJWT.middleware.js';
import { authorize } from '../../../middlewares/authorization.middleware.js';
import { ROLES } from '../../../constants.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import JobController from '../../../controllers/job.controller.js';

const router = express.Router();
router.post('/', verifyJWT, authorize(ROLES.RECRUITER), asyncHandler(JobController.post));
router.get('/:id', verifyJWT, asyncHandler(JobController.getById));
router.post('/:id/applications', verifyJWT, authorize(ROLES.APPLICANT), asyncHandler(JobController.submitApplication));

export default router;