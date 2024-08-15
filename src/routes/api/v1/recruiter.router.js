import express from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js'
import RecruiterController from '../../../controllers/recruiter.controller.js';

const router  = express.Router();
router.post('/register', asyncHandler(RecruiterController.register));
router.post('/authenticate', asyncHandler(RecruiterController.authenticate));
router.post('/authenticate/refresh', asyncHandler(RecruiterController.refreshAuthentication));

export default router;