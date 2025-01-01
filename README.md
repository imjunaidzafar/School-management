# School Management System API

A RESTful API service for managing schools, classrooms, and students with role-based access control.

## Features

- JWT-based authentication
- Role-based access control (RBAC)
- MongoDB database
- Input validation
- Rate limiting
- Security measures (helmet, cors)
- Error handling

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env` file with required environment variables (see below)
4. Seed the database: `npm run seed`
5. Start the server: `npm run dev`

## API Documentation

### Authentication

POST /api/auth/login
- Login with email and password
- Returns JWT token

### Schools

GET /api/schools
- Get all schools (requires authentication)
- Roles: superadmin, school_admin

POST /api/schools
- Create a new school
- Role: superadmin

GET /api/schools/:id
- Get school by ID
- Roles: superadmin, school_admin (own school only)

PUT /api/schools/:id
- Update school
- Role: superadmin

DELETE /api/schools/:id
- Delete school
- Role: superadmin

### Classrooms

GET /api/classrooms
- Get all classrooms (requires authentication)
- Roles: superadmin, school_admin

POST /api/classrooms
- Create a new classroom
- Roles: superadmin, school_admin

GET /api/classrooms/:id
- Get classroom by ID
- Roles: superadmin, school_admin (own school only)

PUT /api/classrooms/:id
- Update classroom
- Roles: superadmin, school_admin (own school only)

DELETE /api/classrooms/:id
- Delete classroom
- Roles: superadmin, school_admin (own school only)

### Students

GET /api/students
- Get all students (requires authentication)
- Roles: superadmin, school_admin

POST /api/students
- Create a new student
- Roles: superadmin, school_admin

GET /api/students/:id
- Get student by ID
- Roles: superadmin, school_admin (own school only)

PUT /api/students/:id
- Update student
- Roles: superadmin, school_admin (own school only)

DELETE /api/students/:id
- Delete student
- Roles: superadmin, school_admin (own school only)

POST /api/students/transfer
- Transfer student to a new classroom
- Roles: superadmin, school_admin (own school only)

## Error Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Testing

Run tests with: `npm test`

## Deployment

To deploy this API:

1. Set up a MongoDB database (local or cloud-based)
2. Configure environment variables for production
3. Build the project: `npm run build`
4. Start the server: `npm start`

## Security Considerations

- Use HTTPS in production
- Regularly update dependencies
- Implement proper logging and monitoring
- Consider using a reverse proxy like Nginx


