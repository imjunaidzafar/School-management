/**
 * @swagger
 * components:
 *   schemas:
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
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */