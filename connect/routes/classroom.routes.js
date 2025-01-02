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

/**
 * @swagger
 * tags:
 *   name: Classrooms
 *   description: Classroom management
 */

/**
 * @swagger
 * /api/classrooms:
 *   post:
 *     summary: Create a new classroom
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - capacity
 *               - schoolId
 *             properties:
 *               name:
 *                 type: string
 *                 example: Class A
 *               capacity:
 *                 type: number
 *                 example: 30
 *               schoolId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               resources:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["Whiteboard", "Projector"]
 *           examples:
 *             classA:
 *               value:
 *                 name: Class A
 *                 capacity: 30
 *                 schoolId: 507f1f77bcf86cd799439011
 *                 resources: ["Whiteboard", "Projector"]
 *             classB:
 *               value:
 *                 name: Class B
 *                 capacity: 25
 *                 schoolId: 507f1f77bcf86cd799439011
 *                 resources: ["Whiteboard", "Computers"]
 *     responses:
 *       201:
 *         description: Classroom created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   get:
 *     summary: Get all classrooms
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of classrooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Classroom'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
router.use(authenticate);

router
  .route('/')
  .post(authorize('superadmin', 'school_admin'), validate(createClassroomSchema), createClassroom)
  .get(authorize('superadmin', 'school_admin', 'student'), getClassrooms);

/**
 * @swagger
 * /api/classrooms/{id}:
 *   get:
 *     summary: Get a classroom by ID
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 507f1f77bcf86cd799439012
 *     responses:
 *       200:
 *         description: Classroom details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Classroom'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Classroom not found
 *   put:
 *     summary: Update a classroom
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 507f1f77bcf86cd799439012
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               capacity:
 *                 type: number
 *               resources:
 *                 type: array
 *                 items:
 *                   type: string
 *           example:
 *             name: Updated Class A
 *             capacity: 35
 *             resources: ["Whiteboard", "Projector", "Computers"]
 *     responses:
 *       200:
 *         description: Classroom updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Classroom not found
 *   delete:
 *     summary: Delete a classroom
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 507f1f77bcf86cd799439012
 *     responses:
 *       200:
 *         description: Classroom deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Classroom not found
 */
router
  .route('/:id')
  .get(authorize('superadmin', 'school_admin', 'student'), schoolAccess, getClassroom)
  .put(authorize('superadmin', 'school_admin'), schoolAccess, validate(updateClassroomSchema), updateClassroom)
  .delete(authorize('superadmin', 'school_admin'), schoolAccess, deleteClassroom);

export default router;