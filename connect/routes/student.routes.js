import express from 'express';
import { authenticate, authorize, schoolAccess } from '../../mws/auth.middleware.js';
import { validate } from '../../mws/validator.middleware.js';
import {
  createStudent,
  getStudents,
  getStudent,
  updateStudent,
  deleteStudent,
  transferStudent
} from '../../libs/controllers/student.controller.js';
import { createStudentSchema, updateStudentSchema } from '../../libs/validation/student.validation.js';

const router = express.Router();

router.use(authenticate);

router
  .route('/')
  .post(authorize('superadmin', 'school_admin'), validate(createStudentSchema), createStudent)
  .get(authorize('superadmin', 'school_admin'), getStudents);

router
  .route('/:id')
  .get(authorize('superadmin', 'school_admin', 'student'), schoolAccess, getStudent)
  .put(authorize('superadmin', 'school_admin'), schoolAccess, validate(updateStudentSchema), updateStudent)
  .delete(authorize('superadmin', 'school_admin'), schoolAccess, deleteStudent);

router.post('/transfer', authorize('superadmin', 'school_admin'), schoolAccess, transferStudent);

export default router;

