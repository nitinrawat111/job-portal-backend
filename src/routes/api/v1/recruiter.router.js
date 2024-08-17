import express from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js'
import RecruiterController from '../../../controllers/recruiter.controller.js';
import { verifyJWT } from '../../../middlewares/verifyJWT.middleware.js';
import { authorize } from '../../../middlewares/authorization.middleware.js';
import { ROLES } from '../../../constants.js';

const router  = express.Router();
router.post('/register', asyncHandler(RecruiterController.register));
router.post('/authenticate', asyncHandler(RecruiterController.authenticate));
router.post('/authenticate/refresh', asyncHandler(RecruiterController.refreshAuthentication));
router.get('/profile', verifyJWT, authorize(ROLES.RECRUITER), asyncHandler(RecruiterController.getProfile));

export default router;