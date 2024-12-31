import request from 'supertest';
import app from '../app.js';
import School from '../libs/models/school.model.js';
import User from '../libs/models/user.model.js';
import mongoose from 'mongoose';
import { generateToken } from '../config/jwt.js';
import dotenv from 'dotenv';

dotenv.config();

describe('School Endpoints', () => {
  let superadminToken;
  let schoolAdminToken;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI_TEST);
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
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
      email: 'school@test.com'
    });

    const schoolAdmin = await User.create({
      email: 'schooladmin@test.com',
      password: 'password123',
      role: 'school_admin',
      schoolId: school._id
    });
    schoolAdminToken = generateToken(schoolAdmin);
  });

  describe('POST /api/schools', () => {
    it('should create a new school when superadmin', async () => {
      const res = await request(app)
        .post('/api/schools')
        .set('Authorization', `Bearer ${superadminToken}`)
        .send({
          name: 'New Test School',
          address: '456 Test Ave',
          contactNumber: '9876543210',
          email: 'newschool@test.com'
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('name', 'New Test School');
    });

    it('should not allow school admin to create a school', async () => {
      const res = await request(app)
        .post('/api/schools')
        .set('Authorization', `Bearer ${schoolAdminToken}`)
        .send({
          name: 'Another Test School',
          address: '789 Test Blvd',
          contactNumber: '5555555555',
          email: 'another@test.com'
        });

      expect(res.statusCode).toBe(403);
    });
  });

  describe('GET /api/schools', () => {
    it('should get all schools', async () => {
      await School.create({
        name: 'Second Test School',
        address: '456 Test Ave',
        contactNumber: '9876543210',
        email: 'second@test.com'
      });

      const res = await request(app)
        .get('/api/schools')
        .set('Authorization', `Bearer ${superadminToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.length).toBe(2);
    });
  });

  // Add more tests for GET /:id, PUT /:id, DELETE /:id
});

