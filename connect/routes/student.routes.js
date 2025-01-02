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

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student management
 */

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Create a new student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - dateOfBirth
 *               - schoolId
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: 2005-05-15
 *               schoolId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               classroomId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439012
 *           examples:
 *             student1:
 *               value:
 *                 firstName: John
 *                 lastName: Doe
 *                 dateOfBirth: 2005-05-15
 *                 schoolId: 507f1f77bcf86cd799439011
 *                 classroomId: 507f1f77bcf86cd799439012
 *             student2:
 *               value:
 *                 firstName: Jane
 *                 lastName: Smith
 *                 dateOfBirth: 2006-02-20
 *                 schoolId: 507f1f77bcf86cd799439011
 *                 classroomId: 507f1f77bcf86cd799439012
 *     responses:
 *       201:
 *         description: Student created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.use(authenticate);

router
  .route('/')
  .post(authorize('superadmin', 'school_admin'), validate(createStudentSchema), createStudent)
  .get(authorize('superadmin', 'school_admin'), getStudents);

/**
 * @swagger
 * /api/students/{id}:
 *   get:
 *     summary: Get a student by ID
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 507f1f77bcf86cd799439013
 *     responses:
 *       200:
 *         description: Student details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Student'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Student not found
 *   put:
 *     summary: Update a student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 507f1f77bcf86cd799439013
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *               schoolId:
 *                 type: string
 *               classroomId:
 *                 type: string
 *           example:
 *             firstName: Updated John
 *             lastName: Updated Doe
 *             dateOfBirth: 2005-06-15
 *             schoolId: 507f1f77bcf86cd799439011
 *             classroomId: 507f1f77bcf86cd799439012
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Student not found
 *   delete:
 *     summary: Delete a student
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 507f1f77bcf86cd799439013
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Student not found
 */
router
  .route('/:id')
  .get(authorize('superadmin', 'school_admin', 'student'), schoolAccess, getStudent)
  .put(authorize('superadmin', 'school_admin'), schoolAccess, validate(updateStudentSchema), updateStudent)
  .delete(authorize('superadmin', 'school_admin'), schoolAccess, deleteStudent);

/**
 * @swagger
 * /api/students/transfer:
 *   post:
 *     summary: Transfer a student to another school or classroom
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - studentId
 *               - newSchoolId
 *               - newClassroomId
 *             properties:
 *               studentId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439013
 *               newSchoolId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439014
 *               newClassroomId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439015
 *           example:
 *             studentId: 507f1f77bcf86cd799439013
 *             newSchoolId: 507f1f77bcf86cd799439014
 *             newClassroomId: 507f1f77bcf86cd799439015
 *     responses:
 *       200:
 *         description: Student transferred successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Student, school, or classroom not found
 */
router.post('/transfer', authorize('superadmin', 'school_admin'), schoolAccess, transferStudent);

export default router;