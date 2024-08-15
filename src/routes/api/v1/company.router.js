import express from 'express';
import { ROLES } from '../../../constants.js';
import { verifyJWT } from '../../../middlewares/verifyJWT.middleware.js';
import { authorize }  from '../../../middlewares/authorization.middleware.js';
import { asyncHandler } from '../../../utils/asyncHandler.js';
import CompanyController from '../../../controllers/company.controller.js';

const router = express.Router();
router.post('/register', verifyJWT, authorize(ROLES.RECRUITER), asyncHandler(CompanyController.register));

export default router;