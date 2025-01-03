/**
 * @swagger
 * components:
 *   schemas:
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Indicates if the operation was successful
 *         message:
 *           type: string
 *           description: A human-readable message describing the result
 *         data:
 *           type: object
 *           description: The response payload
 *     
 *     ValidationError:
 *       type: object
 *       properties:
 *         field:
 *           type: string
 *           description: The field that failed validation
 *         message:
 *           type: string
 *           description: The validation error message
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *         details:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/ValidationError'
 *
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           example: superadmin@example.com
 *           description: User's email address
 *         password:
 *           type: string
 *           example: superadmin123
 *           description: User's password
 * 
 *     LoginResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             data:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 role:
 *                   type: string
 *                   example: superadmin
 * 
 *     School:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - contactNumber
 *         - email
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *           description: The auto-generated id of the school
 *         name:
 *           type: string
 *           example: Example School
 *           description: The name of the school
 *         address:
 *           type: string
 *           example: 123 School St, City, Country
 *           description: The address of the school
 *         contactNumber:
 *           type: string
 *           example: 1234567890
 *           description: The contact number of the school
 *         email:
 *           type: string
 *           example: contact@exampleschool.com
 *           description: The email of the school
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T00:00:00.000Z
 * 
 *     SchoolResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/School'
 * 
 *     CreateSchool:
 *       type: object
 *       required:
 *         - name
 *         - address
 *         - contactNumber
 *         - email
 *       properties:
 *         name:
 *           type: string
 *           example: Example School
 *         address:
 *           type: string
 *           example: 123 School St, City, Country
 *         contactNumber:
 *           type: string
 *           example: 1234567890
 *         email:
 *           type: string
 *           example: contact@exampleschool.com
 * 
 *     Classroom:
 *       type: object
 *       required:
 *         - name
 *         - capacity
 *         - schoolId
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439012
 *           description: The auto-generated id of the classroom
 *         name:
 *           type: string
 *           example: Class A
 *           description: The name of the classroom
 *         capacity:
 *           type: number
 *           example: 30
 *           description: The capacity of the classroom
 *         schoolId:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *           description: The id of the school this classroom belongs to
 *         resources:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Whiteboard", "Projector"]
 *           description: List of resources available in the classroom
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T00:00:00.000Z
 * 
 *     ClassroomResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/Classroom'
 *
 *     ClassroomListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Classroom'
 * 
 *     StudentListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Student'
*     SchoolListResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/School'
 * 
 *     CreateClassroom:
 *       type: object
 *       required:
 *         - name
 *         - capacity
 *         - schoolId
 *       properties:
 *         name:
 *           type: string
 *           example: Class A
 *         capacity:
 *           type: number
 *           example: 30
 *         schoolId:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         resources:
 *           type: array
 *           items:
 *             type: string
 *           example: ["Whiteboard", "Projector"]
 * 
 *     Student:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - dateOfBirth
 *         - schoolId
 *       properties:
 *         _id:
 *           type: string
 *           example: 507f1f77bcf86cd799439013
 *           description: The auto-generated id of the student
 *         firstName:
 *           type: string
 *           example: John
 *           description: The first name of the student
 *         lastName:
 *           type: string
 *           example: Doe
 *           description: The last name of the student
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: 2005-05-15
 *           description: The date of birth of the student
 *         schoolId:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *           description: The id of the school this student belongs to
 *         classroomId:
 *           type: string
 *           example: 507f1f77bcf86cd799439012
 *           description: The id of the classroom this student belongs to
 *         enrollmentDate:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T00:00:00.000Z
 *         createdAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T00:00:00.000Z
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           example: 2023-01-01T00:00:00.000Z
 * 
 *     StudentResponse:
 *       allOf:
 *         - $ref: '#/components/schemas/ApiResponse'
 *         - type: object
 *           properties:
 *             data:
 *               $ref: '#/components/schemas/Student'
 * 
 *     CreateStudent:
 *       type: object
 *       required:
 *         - firstName
 *         - lastName
 *         - dateOfBirth
 *         - schoolId
 *       properties:
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Doe
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: 2005-05-15
 *         schoolId:
 *           type: string
 *           example: 507f1f77bcf86cd799439011
 *         classroomId:
 *           type: string
 *           example: 507f1f77bcf86cd799439012
 * 
 *     TransferStudent:
 *       type: object
 *       required:
 *         - studentId
 *         - newSchoolId
 *         - newClassroomId
 *       properties:
 *         studentId:
 *           type: string
 *           example: 507f1f77bcf86cd799439013
 *         newSchoolId:
 *           type: string
 *           example: 507f1f77bcf86cd799439014
 *         newClassroomId:
 *           type: string
 *           example: 507f1f77bcf86cd799439015
 *
 *   responses:
 *     BadRequest:
 *       description: Invalid input data
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *             success: false
 *             message: Validation error
 *             details:
 *               - field: name
 *                 message: Name is required
 *               - field: capacity
 *                 message: Capacity must be a positive number
 *
 *     Unauthorized:
 *       description: Authentication failed
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *             success: false
 *             message: Invalid token
 *
 *     Forbidden:
 *       description: Permission denied
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *             success: false
 *             message: You don't have permission to perform this action
 *
 *     NotFound:
 *       description: Resource not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *             success: false
 *             message: Resource not found
 *
 *     InternalServerError:
 *       description: Server error
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 *           example:
 *             success: false
 *             message: Internal server error
 * 
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */