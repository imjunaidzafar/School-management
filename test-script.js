import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = process.env.API_URL || 'http://localhost:3000/api';

async function apiRequest(endpoint, method = 'GET', body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null,
    });
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error(`Error in API request to ${endpoint}:`, error);
    return { status: 500, data: { message: 'Internal server error' } };
  }
}

async function runTests() {
  console.log('Starting School Management API Tests\n');

  // Superadmin tests
  console.log('1. Superadmin Tests:');
  const superadminLogin = await apiRequest('/auth/login', 'POST', {
    email: 'superadmin@example.com',
    password: 'superadmin123',
  });
  console.log('Superadmin Login:', superadminLogin.status, superadminLogin.data);
  
  if (superadminLogin.status !== 200) {
    console.error('Superadmin login failed. Aborting further tests.');
    return;
  }

  const superadminToken = superadminLogin.data.token;

  // Schools
  console.log('\nSchools (Superadmin):');
  const getSchools = await apiRequest('/schools', 'GET', null, superadminToken);
  console.log('Get all schools:', getSchools.status, getSchools.data);

  const createSchool = await apiRequest('/schools', 'POST', {
    name: 'New Test School',
    address: '789 New St',
    contactNumber: '1112223333',
    email: 'new@school.com',
  }, superadminToken);
  console.log('Create school:', createSchool.status, createSchool.data);

  if (createSchool.status === 201 && createSchool.data._id) {
    const updateSchool = await apiRequest(`/schools/${createSchool.data._id}`, 'PUT', {
      name: 'Updated Test School',
    }, superadminToken);
    console.log('Update school:', updateSchool.status, updateSchool.data);

    // const deleteSchool = await apiRequest(`/schools/${createSchool.data._id}`, 'DELETE', null, superadminToken);
    // console.log('Delete school:', deleteSchool.status, deleteSchool.data);
  }

  // Classrooms
  console.log('\nClassrooms (Superadmin):');
  const getClassrooms = await apiRequest('/classrooms', 'GET', null, superadminToken);
  console.log('Get all classrooms:', getClassrooms.status, getClassrooms.data);

  if (getSchools.data && getSchools.data.length > 0) {
    const createClassroom = await apiRequest('/classrooms', 'POST', {
      name: 'New Test Class',
      capacity: 40,
      schoolId: getSchools.data[0]._id,
      resources: ['Whiteboard', 'Projector']
    }, superadminToken);
    console.log('Create classroom:', createClassroom.status, createClassroom.data);

    if (createClassroom.status === 201 && createClassroom.data._id) {
      const updateClassroom = await apiRequest(`/classrooms/${createClassroom.data._id}`, 'PUT', {
        capacity: 45,
        resources: ['Whiteboard', 'Projector', 'Computers']
      }, superadminToken);
      console.log('Update classroom:', updateClassroom.status, updateClassroom.data);

      // const deleteClassroom = await apiRequest(`/classrooms/${createClassroom.data._id}`, 'DELETE', null, superadminToken);
      // console.log('Delete classroom:', deleteClassroom.status, deleteClassroom.data);
    }
  }

  // Students
  console.log('\nStudents (Superadmin):');
  const getStudents = await apiRequest('/students', 'GET', null, superadminToken);
  console.log('Get all students:', getStudents.status, getStudents.data);

  if (getSchools.data && getSchools.data.length > 0 && getClassrooms.data && getClassrooms.data.length > 0) {
    const createStudent = await apiRequest('/students', 'POST', {
      firstName: 'New',
      lastName: 'Student',
      dateOfBirth: '2003-04-15',
      schoolId: getSchools.data[0]._id,
      classroomId: getClassrooms.data[0]._id,
    }, superadminToken);
    console.log('Create student:', createStudent.status, createStudent.data);

    if (createStudent.status === 201 && createStudent.data._id) {
      const updateStudent = await apiRequest(`/students/${createStudent.data._id}`, 'PUT', {
        firstName: 'Updated',
      }, superadminToken);
      console.log('Update student:', updateStudent.status, updateStudent.data);

      // const deleteStudent = await apiRequest(`/students/${createStudent.data._id}`, 'DELETE', null, superadminToken);
      // console.log('Delete student:', deleteStudent.status, deleteStudent.data);
    }
  }

  // School Admin tests
  console.log('\n2. School Admin Tests:');
  const schoolAdminLogin = await apiRequest('/auth/login', 'POST', {
    email: 'schooladmin@example.com',
    password: 'schooladmin123',
  });
  console.log('School Admin Login:', schoolAdminLogin.status, schoolAdminLogin.data);
  
  if (schoolAdminLogin.status !== 200) {
    console.error('School admin login failed. Aborting further tests.');
    return;
  }

  const schoolAdminToken = schoolAdminLogin.data.token;

  // Schools (limited access)
  console.log('\nSchools (School Admin - limited access):');
  const getSchoolsAdmin = await apiRequest('/schools', 'GET', null, schoolAdminToken);
  console.log('Get schools (should only see own school):', getSchoolsAdmin.status, getSchoolsAdmin.data);

  const createSchoolAdmin = await apiRequest('/schools', 'POST', {
    name: 'Unauthorized School',
    address: '999 Fail St',
    contactNumber: '9998887777',
    email: 'fail@school.com',
  }, schoolAdminToken);
  console.log('Create school (should fail):', createSchoolAdmin.status, createSchoolAdmin.data);

  // Classrooms
  console.log('\nClassrooms (School Admin):');
  const getClassroomsAdmin = await apiRequest('/classrooms', 'GET', null, schoolAdminToken);
  console.log('Get classrooms (should only see own school):', getClassroomsAdmin.status, getClassroomsAdmin.data);

  if (getSchoolsAdmin.data && getSchoolsAdmin.data.length > 0) {
    const createClassroomAdmin = await apiRequest('/classrooms', 'POST', {
      name: 'Admin Test Class',
      capacity: 35,
      schoolId: getSchoolsAdmin.data[0]._id,
      resources: ['Whiteboard', 'Tablets']
    }, schoolAdminToken);
    console.log('Create classroom:', createClassroomAdmin.status, createClassroomAdmin.data);

    if (createClassroomAdmin.status === 201 && createClassroomAdmin.data._id) {
      const updateClassroomAdmin = await apiRequest(`/classrooms/${createClassroomAdmin.data._id}`, 'PUT', {
        capacity: 38,
        resources: ['Whiteboard', 'Tablets', 'Smart TV']
      }, schoolAdminToken);
      console.log('Update classroom:', updateClassroomAdmin.status, updateClassroomAdmin.data);

      // const deleteClassroomAdmin = await apiRequest(`/classrooms/${createClassroomAdmin.data._id}`, 'DELETE', null, schoolAdminToken);
      // console.log('Delete classroom:', deleteClassroomAdmin.status, deleteClassroomAdmin.data);
    }
  }

  // Students
  console.log('\nStudents (School Admin):');
  const getStudentsAdmin = await apiRequest('/students', 'GET', null, schoolAdminToken);
  console.log('Get students (should only see own school):', getStudentsAdmin.status, getStudentsAdmin.data);

  if (getSchoolsAdmin.data && getSchoolsAdmin.data.length > 0 && getClassroomsAdmin.data && getClassroomsAdmin.data.length > 0) {
    const createStudentAdmin = await apiRequest('/students', 'POST', {
      firstName: 'Admin',
      lastName: 'Student',
      dateOfBirth: '2004-05-20',
      schoolId: getSchoolsAdmin.data[0]._id,
      classroomId: getClassroomsAdmin.data[0]._id,
    }, schoolAdminToken);
    console.log('Create student:', createStudentAdmin.status, createStudentAdmin.data);

    if (createStudentAdmin.status === 201 && createStudentAdmin.data._id) {
      const updateStudentAdmin = await apiRequest(`/students/${createStudentAdmin.data._id}`, 'PUT', {
        firstName: 'UpdatedAdmin',
      }, schoolAdminToken);
      console.log('Update student:', updateStudentAdmin.status, updateStudentAdmin.data);

      // Test student transfer
      // if (getClassroomsAdmin.data.length > 1) {
      //   const transferStudent = await apiRequest(`/students/${createStudentAdmin.data._id}/transfer`, 'POST', {
      //     newClassroomId: getClassroomsAdmin.data[1]._id
      //   }, schoolAdminToken);
      //   console.log('Transfer student:', transferStudent.status, transferStudent.data);
      // }

      // const deleteStudentAdmin = await apiRequest(`/students/${createStudentAdmin.data._id}`, 'DELETE', null, schoolAdminToken);
      // console.log('Delete student:', deleteStudentAdmin.status, deleteStudentAdmin.data);
    }
  }

  // Try to access resources from another school (should fail)
  console.log('\nTrying to access resources from another school (should fail):');
  if (getClassrooms.data && getClassrooms.data.length > 0) {
    const otherSchoolClassroom = getClassrooms.data.find(c => c.schoolId !== getSchoolsAdmin.data[0]._id);
    if (otherSchoolClassroom) {
      const getOtherClassroom = await apiRequest(`/classrooms/${otherSchoolClassroom._id}`, 'GET', null, schoolAdminToken);
      console.log('Get classroom from another school:', getOtherClassroom.status, getOtherClassroom.data);
    }
  }

  if (getStudents.data && getStudents.data.length > 0) {
    const otherSchoolStudent = getStudents.data.find(s => s.schoolId !== getSchoolsAdmin.data[0]._id);
    if (otherSchoolStudent) {
      const getOtherStudent = await apiRequest(`/students/${otherSchoolStudent._id}`, 'GET', null, schoolAdminToken);
      console.log('Get student from another school:', getOtherStudent.status, getOtherStudent.data);
    }
  }

  // Student tests
  console.log('\n3. Student Tests:');
  const studentLogin = await apiRequest('/auth/login', 'POST', {
    email: 'john.doe@example.com',
    password: 'student123',
  });
  console.log('Student Login:', studentLogin.status, studentLogin.data);
  
  if (studentLogin.status !== 200) {
    console.error('Student login failed. Aborting further tests.');
    return;
  }

  const studentToken = studentLogin.data.token;

  // Try to access restricted resources (should fail)
  console.log('\nTrying to access restricted resources as a student (should fail):');
  const getSchoolsStudent = await apiRequest('/schools', 'GET', null, studentToken);
  console.log('Get schools:', getSchoolsStudent.status, getSchoolsStudent.data);

  const getClassroomsStudent = await apiRequest('/classrooms', 'GET', null, studentToken);
  console.log('Get classrooms:', getClassroomsStudent.status, getClassroomsStudent.data);

  const getStudentsStudent = await apiRequest('/students', 'GET', null, studentToken);
  console.log('Get students:', getStudentsStudent.status, getStudentsStudent.data);

  // Get own profile
  console.log('\nGet own profile (Student):');
  const getOwnProfile = await apiRequest('/students/profile', 'GET', null, studentToken);
  console.log('Get own profile:', getOwnProfile.status, getOwnProfile.data);

  console.log('\nSchool Management API Tests Completed');
}

runTests().catch(console.error);

