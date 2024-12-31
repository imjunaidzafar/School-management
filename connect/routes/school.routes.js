import express from 'express';
import { authenticate, authorize, schoolAccess } from '../../mws/auth.middleware.js';
import { validate } from '../../mws/validator.middleware.js';
import {
  createSchool,
  getSchools,
  getSchool,
  updateSchool,
  deleteSchool
} from '../../libs/controllers/school.controller.js';
import { createSchoolSchema, updateSchoolSchema } from '../../libs/validation/school.validation.js';

const router = express.Router();

router.use(authenticate);

router
  .route('/')
  .post(authorize('superadmin'), validate(createSchoolSchema), createSchool)
  .get(authorize('superadmin', 'school_admin'), getSchools);

router
  .route('/:id')
  .get(authorize('superadmin', 'school_admin'), schoolAccess, getSchool)
  .put(authorize('superadmin'), validate(updateSchoolSchema), updateSchool)
  .delete(authorize('superadmin'), deleteSchool);

export default router;

