import express from 'express';
import { authenticate, authorize, schoolAccess } from '../../mws/auth.middleware.js';
import { validate } from '../../mws/validator.middleware.js';
import {
  createClassroom,
  getClassrooms,
  getClassroom,
  updateClassroom,
  deleteClassroom
} from '../../libs/controllers/classroom.controller.js';
import { createClassroomSchema, updateClassroomSchema } from '../../libs/validation/classroom.validation.js';

const router = express.Router();

router.use(authenticate);

router
  .route('/')
  .post(authorize('superadmin', 'school_admin'), validate(createClassroomSchema), createClassroom)
  .get(authorize('superadmin', 'school_admin', 'student'), getClassrooms);

router
  .route('/:id')
  .get(authorize('superadmin', 'school_admin', 'student'), schoolAccess, getClassroom)
  .put(authorize('superadmin', 'school_admin'), schoolAccess, validate(updateClassroomSchema), updateClassroom)
  .delete(authorize('superadmin', 'school_admin'), schoolAccess, deleteClassroom);

export default router;

