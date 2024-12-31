import dotenv from 'dotenv';
import connectDB from '../config/database.js';
import User from '../libs/models/user.model.js';
import School from '../libs/models/school.model.js';
import Classroom from '../libs/models/classroom.model.js';
import Student from '../libs/models/student.model.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await School.deleteMany({});
    await Classroom.deleteMany({});
    await Student.deleteMany({});

    // Create superadmin
    const superadmin = await User.create({
      email: 'superadmin@example.com',
      password: 'superadmin123',
      role: 'superadmin'
    });
    console.log('Superadmin created:', superadmin.email);

    // Create a school
    const school = await School.create({
      name: 'Example School',
      address: '123 School St, City, Country',
      contactNumber: '1234567890',
      email: 'contact@exampleschool.com'
    });
    console.log('School created:', school.name);

    // Create school admin
    const schoolAdmin = await User.create({
      email: 'schooladmin@example.com',
      password: 'schooladmin123',
      role: 'school_admin',
      schoolId: school._id
    });
    console.log('School admin created:', schoolAdmin.email);

    // Create classrooms
    const classroom1 = await Classroom.create({
      name: 'Class A',
      capacity: 30,
      schoolId: school._id,
      resources: ['Whiteboard', 'Projector']
    });
    const classroom2 = await Classroom.create({
      name: 'Class B',
      capacity: 25,
      schoolId: school._id,
      resources: ['Whiteboard', 'Computers']
    });
    console.log('Classrooms created:', classroom1.name, classroom2.name);

    // Create students
    const student1 = await Student.create({
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '2005-05-15',
      schoolId: school._id,
      classroomId: classroom1._id
    });
    const student2 = await Student.create({
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: '2006-02-20',
      schoolId: school._id,
      classroomId: classroom2._id
    });
    console.log('Students created:', student1.firstName, student2.firstName);

    // Create student users
    const studentUser1 = await User.create({
      email: 'john.doe@example.com',
      password: 'student123',
      role: 'student',
      schoolId: school._id,
      studentId: student1._id
    });
    const studentUser2 = await User.create({
      email: 'jane.smith@example.com',
      password: 'student123',
      role: 'student',
      schoolId: school._id,
      studentId: student2._id
    });
    console.log('Student users created:', studentUser1.email, studentUser2.email);

    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

