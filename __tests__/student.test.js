import request from 'supertest';
import app from '../app.js';
import Student from '../libs/models/student.model.js';
import School from '../libs/models/school.model.js';
import Classroom from '../libs/models/classroom.model.js';
import User from '../libs/models/user.model.js';
import mongoose from 'mongoose';
import { generateToken } from '../config/jwt.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Student Endpoints', () => {
  let superadminToken;
  let schoolAdminToken;
  let schoolId;
  let classroomId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await Student.deleteMany({});
    await Classroom.deleteMany({});
    await School.deleteMany({});
    await User.deleteMany({});
    
    const superadmin = await User.create({
      email: 'superadmin@test.com',
      password: 'password123',
      role: 'superadmin'
    });
    superadminToken = generateToken(superadmin);

    const school = await School.create({
      name: 'Test School',
      address: '123 Test St',
      contactNumber: '1234567890',
      email: 'test@school.com'
    });
    schoolId = school._id;

    const classroom = await Classroom.create({
      name: 'Test Classroom',
      capacity: 30,
      schoolId: schoolId
    });
    classroomId = classroom._id;

    const schoolAdmin = await User.create({
      email: 'schooladmin@test.com',
      password: 'password123',
      role: 'school_admin',
      schoolId: schoolId
    });
    schoolAdminToken = generateToken(schoolAdmin);
  });

  describe('POST /api/students', () => {
    it('should create a new student when superadmin', async () => {
      const res = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${superadminToken}`)
        .send({
          firstName: 'John',
          lastName: 'Doe',
          dateOfBirth: '2000-01-01',
          schoolId: schoolId.toString(),
          classroomId: classroomId.toString()
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('firstName', 'John');
    });

    it('should create a new student when school admin', async () => {
      const res = await request(app)
        .post('/api/students')
        .set('Authorization', `Bearer ${schoolAdminToken}`)
        .send({
          firstName: 'Jane',
          lastName: 'Doe',
          dateOfBirth: '2000-01-01',
          schoolId: schoolId.toString(),
          classroomId: classroomId.toString()
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('firstName', 'Jane');
    });
  });

  describe('GET /api/students', () => {
    it('should get all students for superadmin', async () => {
      await Student.create({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '2000-01-01',
        schoolId: schoolId,
        classroomId: classroomId
      });

      await Student.create({
        firstName: 'Jane',
        lastName: 'Doe',
        dateOfBirth: '2000-02-02',
        schoolId: schoolId,
        classroomId: classroomId
      });

      const res = await request(app)
        .get('/api/students')
        .set('Authorization', `Bearer ${superadminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
    });

    it('should get only school-specific students for school admin', async () => {
      await Student.create({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '2000-01-01',
        schoolId: schoolId,
        classroomId: classroomId
      });

      const otherSchool = await School.create({
        name: 'Other School',
        address: '456 Other St',
        contactNumber: '0987654321',
        email: 'other@school.com'
      });

      await Student.create({
        firstName: 'Jane',
        lastName: 'Doe',
        dateOfBirth: '2000-02-02',
        schoolId: otherSchool._id,
        classroomId: classroomId
      });

      const res = await request(app)
        .get('/api/students')
        .set('Authorization', `Bearer ${schoolAdminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].firstName).toBe('John');
    });
  });

  describe('PUT /api/students/:id', () => {
    it('should update a student', async () => {
      const student = await Student.create({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '2000-01-01',
        schoolId: schoolId,
        classroomId: classroomId
      });

      const res = await request(app)
        .put(`/api/students/${student._id}`)
        .set('Authorization', `Bearer ${schoolAdminToken}`)
        .send({
          firstName: 'Jane',
          lastName: 'Smith'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.firstName).toBe('Jane');
      expect(res.body.lastName).toBe('Smith');
    });
  });

  describe('DELETE /api/students/:id', () => {
    it('should delete a student', async () => {
      const student = await Student.create({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '2000-01-01',
        schoolId: schoolId,
        classroomId: classroomId
      });

      const res = await request(app)
        .delete(`/api/students/${student._id}`)
        .set('Authorization', `Bearer ${schoolAdminToken}`);

      expect(res.statusCode).toBe(204);

      const deletedStudent = await Student.findById(student._id);
      expect(deletedStudent).toBeNull();
    });
  });

  describe('POST /api/students/transfer', () => {
    it('should transfer a student to a new classroom', async () => {
      const student = await Student.create({
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '2000-01-01',
        schoolId: schoolId,
        classroomId: classroomId
      });

      const newClassroom = await Classroom.create({
        name: 'New Classroom',
        capacity: 30,
        schoolId: schoolId
      });

      const res = await request(app)
        .post('/api/students/transfer')
        .set('Authorization', `Bearer ${schoolAdminToken}`)
        .send({
          studentId: student._id,
          newClassroomId: newClassroom._id
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.classroomId).toBe(newClassroom._id.toString());
    });
  });
});

