import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { apiLimiter } from "./mws/rateLimiter.middleware.js";
import { errorHandler } from "./mws/errorHandler.middleware.js";

import authRoutes from "./connect/routes/auth.routes.js";
import schoolRoutes from "./connect/routes/school.routes.js";
import classroomRoutes from "./connect/routes/classroom.routes.js";
import studentRoutes from "./connect/routes/student.routes.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Get current directory from import.meta.url (for ES modules)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// CORS configuration
app.use(
  cors({
    origin:
      process.env.ENVIRONMENT === "production"
        ? "https://school-management-api-ruby.vercel.app"
        : "*", // Adjust based on your production setup
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(apiLimiter);

// Swagger setup with dynamic server URLs for different environments
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "School Management API",
      version: "1.0.0",
      description: "API for managing schools, classrooms, and students",
    },
    servers: [
      {
        url:
          process.env.ENVIRONMENT === "production"
            ? "https://school-management-api-ruby.vercel.app/"
            : `http://localhost:${process.env.PORT || 3000}`,
        description:
          process.env.ENVIRONMENT === "production"
            ? "Production server"
            : "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ["./connect/routes/*.js", "./swagger-schemas.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Manually serve Swagger UI static assets from node_modules
app.use(
  "/api-docs/swagger-ui.css",
  express.static(
    path.join(__dirname, "node_modules", "swagger-ui-dist", "swagger-ui.css")
  )
);
app.use(
  "/api-docs/swagger-ui-bundle.js",
  express.static(
    path.join(
      __dirname,
      "node_modules",
      "swagger-ui-dist",
      "swagger-ui-bundle.js"
    )
  )
);
app.use(
  "/api-docs/swagger-ui-standalone-preset.js",
  express.static(
    path.join(
      __dirname,
      "node_modules",
      "swagger-ui-dist",
      "swagger-ui-standalone-preset.js"
    )
  )
);

// Set up Swagger UI with the correct settings
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCssUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.50.0/swagger-ui.css", // Use CDN for production
    customJsUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/3.50.0/swagger-ui-bundle.js",
    oauth2RedirectUrl:
      process.env.ENVIRONMENT === "production"
        ? "https://school-management-api-ruby.vercel.app/api-docs/oauth2-redirect"
        : "http://localhost:3000/api-docs/oauth2-redirect", // Adjust for local and production
  })
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/api/students", studentRoutes);

// Error handling middleware
app.use(errorHandler);

export default app;
