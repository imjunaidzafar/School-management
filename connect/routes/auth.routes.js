import express from 'express';
import { login, register } from '../../libs/controllers/auth.controller.js';
import { validate } from '../../mws/validator.middleware.js';
import { loginSchema, registerSchema } from '../../libs/validation/auth.validation.js';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: superadmin@example.com
 *               password:
 *                 type: string
 *                 example: superadmin123
 *           examples:
 *             superadmin:
 *               value:
 *                 email: superadmin@example.com
 *                 password: superadmin123
 *             schoolAdmin:
 *               value:
 *                 email: schooladmin@example.com
 *                 password: schooladmin123
 *             student:
 *               value:
 *                 email: john.doe@example.com
 *                 password: student123
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 role:
 *                   type: string
 *                   example: superadmin
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', validate(loginSchema), login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 example: newuser@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               role:
 *                 type: string
 *                 enum: [superadmin, school_admin, student]
 *                 example: school_admin
 *               schoolId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439011
 *               studentId:
 *                 type: string
 *                 example: 507f1f77bcf86cd799439013
 *           examples:
 *             schoolAdmin:
 *               value:
 *                 email: newadmin@example.com
 *                 password: admin123
 *                 role: school_admin
 *                 schoolId: 507f1f77bcf86cd799439011
 *             student:
 *               value:
 *                 email: newstudent@example.com
 *                 password: student123
 *                 role: student
 *                 schoolId: 507f1f77bcf86cd799439011
 *                 studentId: 507f1f77bcf86cd799439013
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 role:
 *                   type: string
 *                   example: school_admin
 *       400:
 *         description: Invalid input
 */
router.post('/register', validate(registerSchema), register);

export default router;