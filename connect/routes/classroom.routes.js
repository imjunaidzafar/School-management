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
 *   description: Classroom management endpoints
 */

/**
 * @swagger
 * /api/classrooms:
 *   post:
 *     summary: Create a new classroom
 *     description: Create a new classroom with the provided details. Requires superadmin or school_admin role.
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateClassroom'
 *           examples:
 *             basicClassroom:
 *               summary: Basic classroom
 *               value:
 *                 name: Class A
 *                 capacity: 30
 *                 schoolId: 507f1f77bcf86cd799439011
 *             classroomWithResources:
 *               summary: Classroom with resources
 *               value:
 *                 name: Computer Lab
 *                 capacity: 25
 *                 schoolId: 507f1f77bcf86cd799439011
 *                 resources: ["Computers", "Projector", "Whiteboard"]
 *     responses:
 *       201:
 *         description: Classroom created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClassroomResponse'
 *             example:
 *               success: true
 *               message: Classroom created successfully
 *               data:
 *                 _id: 507f1f77bcf86cd799439012
 *                 name: Class A
 *                 capacity: 30
 *                 schoolId: 507f1f77bcf86cd799439011
 *                 resources: ["Whiteboard", "Projector"]
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
 *     summary: Get all classrooms
 *     description: Retrieve a list of all classrooms. Results are filtered based on user role.
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of classrooms retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClassroomListResponse'
 *             example:
 *               success: true
 *               message: Classrooms retrieved successfully
 *               data:
 *                 - _id: 507f1f77bcf86cd799439012
 *                   name: Class A
 *                   capacity: 30
 *                   schoolId: 507f1f77bcf86cd799439011
 *                   resources: ["Whiteboard", "Projector"]
 *                   createdAt: "2023-01-01T00:00:00.000Z"
 *                   updatedAt: "2023-01-01T00:00:00.000Z"
 *                 - _id: 507f1f77bcf86cd799439013
 *                   name: Computer Lab
 *                   capacity: 25
 *                   schoolId: 507f1f77bcf86cd799439011
 *                   resources: ["Computers", "Projector", "Whiteboard"]
 *                   createdAt: "2023-01-01T00:00:00.000Z"
 *                   updatedAt: "2023-01-01T00:00:00.000Z"
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
  .post(authorize('superadmin', 'school_admin'), validate(createClassroomSchema), createClassroom)
  .get(authorize('superadmin', 'school_admin', 'student'), getClassrooms);

/**
 * @swagger
 * /api/classrooms/{id}:
 *   get:
 *     summary: Get a classroom by ID
 *     description: Retrieve detailed information about a specific classroom.
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the classroom to retrieve
 *         example: 507f1f77bcf86cd799439012
 *     responses:
 *       200:
 *         description: Classroom details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClassroomResponse'
 *             example:
 *               success: true
 *               message: Classroom retrieved successfully
 *               data:
 *                 _id: 507f1f77bcf86cd799439012
 *                 name: Class A
 *                 capacity: 30
 *                 schoolId: 507f1f77bcf86cd799439011
 *                 resources: ["Whiteboard", "Projector"]
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
 *     summary: Update a classroom
 *     description: Update the details of an existing classroom.
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the classroom to update
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
 *           examples:
 *             updateName:
 *               summary: Update classroom name
 *               value:
 *                 name: Updated Class A
 *             updateCapacity:
 *               summary: Update classroom capacity
 *               value:
 *                 capacity: 35
 *             updateResources:
 *               summary: Update classroom resources
 *               value:
 *                 resources: ["Whiteboard", "Projector", "Computers"]
 *             updateAll:
 *               summary: Update all fields
 *               value:
 *                 name: Updated Class A
 *                 capacity: 35
 *                 resources: ["Whiteboard", "Projector", "Computers"]
 *     responses:
 *       200:
 *         description: Classroom updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClassroomResponse'
 *             example:
 *               success: true
 *               message: Classroom updated successfully
 *               data:
 *                 _id: 507f1f77bcf86cd799439012
 *                 name: Updated Class A
 *                 capacity: 35
 *                 schoolId: 507f1f77bcf86cd799439011
 *                 resources: ["Whiteboard", "Projector", "Computers"]
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
 *     summary: Delete a classroom
 *     description: Delete an existing classroom. This action cannot be undone.
 *     tags: [Classrooms]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the classroom to delete
 *         example: 507f1f77bcf86cd799439012
 *     responses:
 *       200:
 *         description: Classroom deleted successfully
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
 *                   example: Classroom deleted successfully
 *             example:
 *               success: true
 *               message: Classroom deleted successfully
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
  .get(authorize('superadmin', 'school_admin', 'student'), schoolAccess, getClassroom)
  .put(authorize('superadmin', 'school_admin'), schoolAccess, validate(updateClassroomSchema), updateClassroom)
  .delete(authorize('superadmin', 'school_admin'), schoolAccess, deleteClassroom);

export default router;