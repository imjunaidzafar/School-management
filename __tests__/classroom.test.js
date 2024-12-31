import request from 'supertest';
import app from '../app.js';
import Classroom from '../libs/models/classroom.model.js';
import School from '../libs/models/school.model.js';
import User from '../libs/models/user.model.js';
import mongoose from 'mongoose';
import { generateToken } from '../config/jwt.js';
import dotenv from 'dotenv';

dotenv.config();

describe('Classroom Endpoints', () => {
  let superadminToken;
  let schoolAdminToken;
  let schoolId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
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

    const schoolAdmin = await User.create({
      email: 'schooladmin@test.com',
      password: 'password123',
      role: 'school_admin',
      schoolId: schoolId
    });
    schoolAdminToken = generateToken(schoolAdmin);
  });

  describe('POST /api/classrooms', () => {
    it('should create a new classroom when superadmin', async () => {
      const res = await request(app)
        .post('/api/classrooms')
        .set('Authorization', `Bearer ${superadminToken}`)
        .send({
          name: 'Test Classroom',
          capacity: 30,
          schoolId: schoolId.toString(),
          resources: ['Whiteboard', 'Projector']
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', 'Test Classroom');
    });

    it('should create a new classroom when school admin', async () => {
      const res = await request(app)
        .post('/api/classrooms')
        .set('Authorization', `Bearer ${schoolAdminToken}`)
        .send({
          name: 'Test Classroom',
          capacity: 30,
          schoolId: schoolId.toString(),
          resources: ['Whiteboard', 'Projector']
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', 'Test Classroom');
    });
  });

  describe('GET /api/classrooms', () => {
    it('should get all classrooms for superadmin', async () => {
      await Classroom.create({
        name: 'Classroom 1',
        capacity: 30,
        schoolId: schoolId
      });

      await Classroom.create({
        name: 'Classroom 2',
        capacity: 25,
        schoolId: schoolId
      });

      const res = await request(app)
        .get('/api/classrooms')
        .set('Authorization', `Bearer ${superadminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
    });

    it('should get only school-specific classrooms for school admin', async () => {
      await Classroom.create({
        name: 'Classroom 1',
        capacity: 30,
        schoolId: schoolId
      });

      const otherSchool = await School.create({
        name: 'Other School',
        address: '456 Other St',
        contactNumber: '0987654321',
        email: 'other@school.com'
      });

      await Classroom.create({
        name: 'Classroom 2',
        capacity: 25,
        schoolId: otherSchool._id
      });

      const res = await request(app)
        .get('/api/classrooms')
        .set('Authorization', `Bearer ${schoolAdminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].name).toBe('Classroom 1');
    });
  });

  // Add more tests for GET /:id, PUT /:id, DELETE /:id
});

