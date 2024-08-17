import express from 'express';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import ApplicantController from '../../../controllers/applicant.controller.js';
import { verifyJWT } from '../../../middlewares/verifyJWT.middleware.js';
import { authorize } from '../../../middlewares/authorization.middleware.js';
import { ROLES } from '../../../constants.js';

const router = express.Router();
router.post('/register', asyncHandler(ApplicantController.register));
router.post('/authenticate', asyncHandler(ApplicantController.authenticate));
router.post('/authenticate/refresh', asyncHandler(ApplicantController.refreshAuthentication));
router.get('/profile', verifyJWT, authorize(ROLES.APPLICANT), asyncHandler(ApplicantController.getProfile));

export default router;