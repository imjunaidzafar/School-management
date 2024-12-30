import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { apiLimiter } from './mws/rateLimiter.middleware.js';
import { errorHandler } from './mws/errorHandler.middleware.js';

import authRoutes from './connect/routes/auth.routes.js';
import schoolRoutes from './connect/routes/school.routes.js';
import classroomRoutes from './connect/routes/classroom.routes.js';
import studentRoutes from './connect/routes/student.routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(apiLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/students', studentRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;

