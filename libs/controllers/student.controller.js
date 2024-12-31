import Student from '../models/student.model.js';

export const createStudent = async (req, res) => {
  try {
    if (req.user.role === 'school_admin') {
      req.body.schoolId = req.user.schoolId;
    }
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStudents = async (req, res) => {
  try {
    const query = req.user.role === 'school_admin' ? { schoolId: req.user.schoolId } : {};
    const students = await Student.find(query)
      .populate('schoolId', 'name')
      .populate('classroomId', 'name');
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id)
      .populate('schoolId', 'name')
      .populate('classroomId', 'name');
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (req.user.role === 'school_admin' && student.schoolId.toString() !== req.user.schoolId.toString()) {
      return res.status(403).json({ message: 'Unauthorized access to this student' });
    }

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (req.user.role === 'school_admin' && student.schoolId.toString() !== req.user.schoolId.toString()) {
      return res.status(403).json({ message: 'Unauthorized access to this student' });
    }

    const updatedStudent = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('schoolId', 'name').populate('classroomId', 'name');
    
    res.json(updatedStudent);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (req.user.role === 'school_admin' && student.schoolId.toString() !== req.user.schoolId.toString()) {
      return res.status(403).json({ message: 'Unauthorized access to this student' });
    }

    await Student.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const transferStudent = async (req, res) => {
  try {
    const { studentId, newClassroomId } = req.body;
    
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    if (req.user.role === 'school_admin' && student.schoolId.toString() !== req.user.schoolId.toString()) {
      return res.status(403).json({ message: 'Unauthorized access to this student' });
    }

    student.classroomId = newClassroomId;
    await student.save();

    res.json(student);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

