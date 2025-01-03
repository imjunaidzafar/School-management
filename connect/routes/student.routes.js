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
 *   description: Student management endpoints
 */

/**
 * @swagger
 * /api/students:
 *   post:
 *     summary: Create a new student
 *     description: Create a new student with the provided details. Requires superadmin or school_admin role.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateStudent'
 *           examples:
 *             basicStudent:
 *               summary: Basic student
 *               value:
 *                 firstName: John
 *                 lastName: Doe
 *                 dateOfBirth: 2005-05-15
 *                 schoolId: 507f1f77bcf86cd799439011
 *             studentWithClassroom:
 *               summary: Student with classroom
 *               value:
 *                 firstName: Jane
 *                 lastName: Smith
 *                 dateOfBirth: 2006-02-20
 *                 schoolId: 507f1f77bcf86cd799439011
 *                 classroomId: 507f1f77bcf86cd799439012
 *     responses:
 *       201:
 *         description: Student created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentResponse'
 *             example:
 *               success: true
 *               message: Student created successfully
 *               data:
 *                 _id: 507f1f77bcf86cd799439013
 *                 firstName: John
 *                 lastName: Doe
 *                 dateOfBirth: 2005-05-15
 *                 schoolId: 507f1f77bcf86cd799439011
 *                 classroomId: 507f1f77bcf86cd799439012
 *                 enrollmentDate: "2023-01-01T00:00:00.000Z"
 *                 createdAt: "2023-01-01T00:00:00.000Z"
 *                 updatedAt: "2023-01-01T00:00:00.000Z"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 * 
 *   get:
 *     summary: Get all students
 *     description: Retrieve a list of all students. Results are filtered based on user role.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of students retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentListResponse'
 *             example:
 *               success: true
 *               message: Students retrieved successfully
 *               data:
 *                 - _id: 507f1f77bcf86cd799439013
 *                   firstName: John
 *                   lastName: Doe
 *                   dateOfBirth: 2005-05-15
 *                   schoolId: 507f1f77bcf86cd799439011
 *                   classroomId: 507f1f77bcf86cd799439012
 *                   enrollmentDate: "2023-01-01T00:00:00.000Z"
 *                   createdAt: "2023-01-01T00:00:00.000Z"
 *                   updatedAt: "2023-01-01T00:00:00.000Z"
 *                 - _id: 507f1f77bcf86cd799439014
 *                   firstName: Jane
 *                   lastName: Smith
 *                   dateOfBirth: 2006-02-20
 *                   schoolId: 507f1f77bcf86cd799439011
 *                   classroomId: 507f1f77bcf86cd799439012
 *                   enrollmentDate: "2023-01-02T00:00:00.000Z"
 *                   createdAt: "2023-01-02T00:00:00.000Z"
 *                   updatedAt: "2023-01-02T00:00:00.000Z"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
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
 *     description: Retrieve detailed information about a specific student.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student to retrieve
 *         example: 507f1f77bcf86cd799439013
 *     responses:
 *       200:
 *         description: Student details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentResponse'
 *             example:
 *               success: true
 *               message: Student retrieved successfully
 *               data:
 *                 _id: 507f1f77bcf86cd799439013
 *                 firstName: John
 *                 lastName: Doe
 *                 dateOfBirth: 2005-05-15
 *                 schoolId: 507f1f77bcf86cd799439011
 *                 classroomId: 507f1f77bcf86cd799439012
 *                 enrollmentDate: "2023-01-01T00:00:00.000Z"
 *                 createdAt: "2023-01-01T00:00:00.000Z"
 *                 updatedAt: "2023-01-01T00:00:00.000Z"
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 * 
 *   put:
 *     summary: Update a student
 *     description: Update the details of an existing student.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student to update
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
 *           examples:
 *             updateName:
 *               summary: Update student name
 *               value:
 *                 firstName: Updated John
 *                 lastName: Updated Doe
 *             updateClassroom:
 *               summary: Update student classroom
 *               value:
 *                 classroomId: 507f1f77bcf86cd799439015
 *             updateAll:
 *               summary: Update all fields
 *               value:
 *                 firstName: Updated John
 *                 lastName: Updated Doe
 *                 dateOfBirth: 2005-06-15
 *                 schoolId: 507f1f77bcf86cd799439014
 *                 classroomId: 507f1f77bcf86cd799439015
 *     responses:
 *       200:
 *         description: Student updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentResponse'
 *             example:
 *               success: true
 *               message: Student updated successfully
 *               data:
 *                 _id: 507f1f77bcf86cd799439013
 *                 firstName: Updated John
 *                 lastName: Updated Doe
 *                 dateOfBirth: 2005-06-15
 *                 schoolId: 507f1f77bcf86cd799439014
 *                 classroomId: 507f1f77bcf86cd799439015
 *                 enrollmentDate: "2023-01-01T00:00:00.000Z"
 *                 createdAt: "2023-01-01T00:00:00.000Z"
 *                 updatedAt: "2023-01-01T00:00:00.000Z"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 * 
 *   delete:
 *     summary: Delete a student
 *     description: Delete an existing student. This action cannot be undone.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the student to delete
 *         example: 507f1f77bcf86cd799439013
 *     responses:
 *       200:
 *         description: Student deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Student deleted successfully
 *             example:
 *               success: true
 *               message: Student deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
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
 *     description: Transfer an existing student to a new school or classroom.
 *     tags: [Students]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TransferStudent'
 *           example:
 *             studentId: 507f1f77bcf86cd799439013
 *             newSchoolId: 507f1f77bcf86cd799439014
 *             newClassroomId: 507f1f77bcf86cd799439015
 *     responses:
 *       200:
 *         description: Student transferred successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/StudentResponse'
 *             example:
 *               success: true
 *               message: Student transferred successfully
 *               data:
 *                 _id: 507f1f77bcf86cd799439013
 *                 firstName: John
 *                 lastName: Doe
 *                 dateOfBirth: 2005-05-15
 *                 schoolId: 507f1f77bcf86cd799439014
 *                 classroomId: 507f1f77bcf86cd799439015
 *                 enrollmentDate: "2023-01-01T00:00:00.000Z"
 *                 createdAt: "2023-01-01T00:00:00.000Z"
 *                 updatedAt: "2023-01-01T00:00:00.000Z"
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       403:
 *         $ref: '#/components/responses/Forbidden'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
router.post('/transfer', authorize('superadmin', 'school_admin'), schoolAccess, transferStudent);

export default router;

