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
 *   description: School management
 */

/**
 * @swagger
 * /api/schools:
 *   post:
 *     summary: Create a new school
 *     tags: [Schools]
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
 *               - address
 *               - contactNumber
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *                 example: Example School
 *               address:
 *                 type: string
 *                 example: 123 School St, City, Country
 *               contactNumber:
 *                 type: string
 *                 example: 1234567890
 *               email:
 *                 type: string
 *                 example: contact@exampleschool.com
 *           examples:
 *             school1:
 *               value:
 *                 name: Example School
 *                 address: 123 School St, City, Country
 *                 contactNumber: 1234567890
 *                 email: contact@exampleschool.com
 *             school2:
 *               value:
 *                 name: Secondary School
 *                 address: 456 Education Ave, City, Country
 *                 contactNumber: 9876543210
 *                 email: info@secondaryschool.com
 *     responses:
 *       201:
 *         description: School created successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *   get:
 *     summary: Get all schools
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of schools
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/School'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
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
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: School details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/School'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: School not found
 *   put:
 *     summary: Update a school
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
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
 *           example:
 *             name: Updated School Name
 *             address: 789 New Address, City, Country
 *             contactNumber: 5551234567
 *             email: updated@school.com
 *     responses:
 *       200:
 *         description: School updated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: School not found
 *   delete:
 *     summary: Delete a school
 *     tags: [Schools]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: School deleted successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: School not found
 */
router
  .route('/:id')
  .get(authorize('superadmin', 'school_admin'), schoolAccess, getSchool)
  .put(authorize('superadmin'), validate(updateSchoolSchema), updateSchool)
  .delete(authorize('superadmin'), deleteSchool);

export default router;