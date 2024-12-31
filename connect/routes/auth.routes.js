import express from 'express';
import { login } from '../../libs/controllers/auth.controller.js';
import { validate } from '../../mws/validator.middleware.js';
import { loginSchema } from '../../libs/validation/auth.validation.js';

const router = express.Router();

router.post('/login', validate(loginSchema), login);

export default router;

