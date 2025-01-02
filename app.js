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
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(apiLimiter);

// Swagger setup with dynamic server URLs
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'School Management API',
      version: '1.0.0',
      description: 'API for managing schools, classrooms, and students',
    },
    servers: [
      {
        url:
          process.env.ENVIRONMENT === 'production'
            ? 'https://school-management-api-ruby.vercel.app/' 
            : `http://localhost:${process.env.PORT || 3000}`,
        description:
          process.env.ENVIRONMENT === 'production' ? 'Production server' : 'Development server',
      },
    ],
  },
  apis: ['./connect/routes/*.js', './swagger-schemas.js'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/classrooms', classroomRoutes);
app.use('/api/students', studentRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;
