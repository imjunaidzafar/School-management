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

/**
 * @swagger
 * tags:
 *   name: Schools
 *   description: School management endpoints
 */

/**
 * @swagger
 * /api/schools:
 *   post:
 *     summary: Create a new school
 *     description: Create a new school with the provided details. Requires superadmin role.
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateSchool'
 *           examples:
 *             basicSchool:
 *               summary: Basic school
 *               value:
 *                 name: Example School
 *                 address: 123 School St, City, Country
 *                 contactNumber: 1234567890
 *                 email: contact@exampleschool.com
 *             detailedSchool:
 *               summary: Detailed school
 *               value:
 *                 name: Secondary School
 *                 address: 456 Education Ave, City, Country
 *                 contactNumber: 9876543210
 *                 email: info@secondaryschool.com
 *     responses:
 *       201:
 *         description: School created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SchoolResponse'
 *             example:
 *               success: true
 *               message: School created successfully
 *               data:
 *                 _id: 507f1f77bcf86cd799439011
 *                 name: Example School
 *                 address: 123 School St, City, Country
 *                 contactNumber: 1234567890
 *                 email: contact@exampleschool.com
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
 *     summary: Get all schools
 *     description: Retrieve a list of all schools. Results are filtered based on user role.
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of schools retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SchoolListResponse'
 *             example:
 *               success: true
 *               message: Schools retrieved successfully
 *               data:
 *                 - _id: 507f1f77bcf86cd799439011
 *                   name: Example School
 *                   address: 123 School St, City, Country
 *                   contactNumber: 1234567890
 *                   email: contact@exampleschool.com
 *                   createdAt: "2023-01-01T00:00:00.000Z"
 *                   updatedAt: "2023-01-01T00:00:00.000Z"
 *                 - _id: 507f1f77bcf86cd799439012
 *                   name: Secondary School
 *                   address: 456 Education Ave, City, Country
 *                   contactNumber: 9876543210
 *                   email: info@secondaryschool.com
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
  .post(authorize('superadmin'), validate(createSchoolSchema), createSchool)
  .get(authorize('superadmin', 'school_admin'), getSchools);

/**
 * @swagger
 * /api/schools/{id}:
 *   get:
 *     summary: Get a school by ID
 *     description: Retrieve detailed information about a specific school.
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the school to retrieve
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: School details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SchoolResponse'
 *             example:
 *               success: true
 *               message: School retrieved successfully
 *               data:
 *                 _id: 507f1f77bcf86cd799439011
 *                 name: Example School
 *                 address: 123 School St, City, Country
 *                 contactNumber: 1234567890
 *                 email: contact@exampleschool.com
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
 *     summary: Update a school
 *     description: Update the details of an existing school.
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the school to update
 *         example: 507f1f77bcf86cd799439011
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               address:
 *                 type: string
 *               contactNumber:
 *                 type: string
 *               email:
 *                 type: string
 *           examples:
 *             updateName:
 *               summary: Update school name
 *               value:
 *                 name: Updated School Name
 *             updateAddress:
 *               summary: Update school address
 *               value:
 *                 address: 789 New Address, City, Country
 *             updateAll:
 *               summary: Update all fields
 *               value:
 *                 name: Updated School Name
 *                 address: 789 New Address, City, Country
 *                 contactNumber: 5551234567
 *                 email: updated@school.com
 *     responses:
 *       200:
 *         description: School updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SchoolResponse'
 *             example:
 *               success: true
 *               message: School updated successfully
 *               data:
 *                 _id: 507f1f77bcf86cd799439011
 *                 name: Updated School Name
 *                 address: 789 New Address, City, Country
 *                 contactNumber: 5551234567
 *                 email: updated@school.com
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
 *     summary: Delete a school
 *     description: Delete an existing school. This action cannot be undone.
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the school to delete
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: School deleted successfully
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
 *                   example: School deleted successfully
 *             example:
 *               success: true
 *               message: School deleted successfully
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
  .get(authorize('superadmin', 'school_admin'), schoolAccess, getSchool)
  .put(authorize('superadmin'), validate(updateSchoolSchema), updateSchool)
  .delete(authorize('superadmin'), deleteSchool);

export default router;

