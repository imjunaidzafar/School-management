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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// **Set trust proxy**
app.set("trust proxy", 1); // Trust the first proxy

// CORS configuration
app.use(
  cors({
    origin:
      process.env.ENVIRONMENT === "production"
        ? "https://school-management-api-ruby.vercel.app"
        : "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Basic middleware
app.use(express.json());
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
  })
);
app.use(morgan("dev"));
app.use(apiLimiter);

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "School Management API",
      version: "1.0.0",
      description: "API for managing schools, classrooms, and students",
      contact: {
        name: "API Support",
        url: "https://school-management-api-ruby.vercel.app",
      },
    },
    servers: [
      {
        url:
          process.env.ENVIRONMENT === "production"
            ? "https://school-management-api-ruby.vercel.app"
            : `http://localhost:${process.env.PORT || 3000}`,
        description:
          process.env.ENVIRONMENT === "production"
            ? "Production server"
            : "Development server",
      },
    ],
  },
  apis: [
    path.resolve(__dirname, "./connect/routes/*.js"),
    path.resolve(__dirname, "./swagger-schemas.js"),
  ],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve static files for Swagger UI
app.use(
  "/swagger-ui",
  express.static(path.join(__dirname, "node_modules/swagger-ui-dist"))
);

// Setup Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: "School Management API Documentation",
    swaggerOptions: {
      url: "/swagger.json", // This will serve the Swagger spec JSON
      persistAuthorization: true,
      displayRequestDuration: true,
      docExpansion: "none",
      filter: true,
    },
  })
);

// Serve Swagger spec as JSON
app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/schools", schoolRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/api/students", studentRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.ENVIRONMENT || "development",
  });
});

// Error handling
app.use(errorHandler);

export default app;
