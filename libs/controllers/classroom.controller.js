import Classroom from '../models/classroom.model.js';

export const createClassroom = async (req, res) => {
  try {
    if (req.user.role === 'school_admin') {
      req.body.schoolId = req.user.schoolId;
    }
    const classroom = await Classroom.create(req.body);
    res.status(201).json(classroom);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getClassrooms = async (req, res) => {
  try {
    const query = req.user.role === 'school_admin' ? { schoolId: req.user.schoolId } : {};
    const classrooms = await Classroom.find(query).populate('schoolId', 'name');
    res.json(classrooms);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id).populate('schoolId', 'name');
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    if (req.user.role === 'school_admin' && classroom.schoolId.toString() !== req.user.schoolId.toString()) {
      return res.status(403).json({ message: 'Unauthorized access to this classroom' });
    }
    res.json(classroom);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    if (req.user.role === 'school_admin' && classroom.schoolId.toString() !== req.user.schoolId.toString()) {
      return res.status(403).json({ message: 'Unauthorized access to this classroom' });
    }
    const updatedClassroom = await Classroom.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedClassroom);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteClassroom = async (req, res) => {
  try {
    const classroom = await Classroom.findById(req.params.id);
    if (!classroom) {
      return res.status(404).json({ message: 'Classroom not found' });
    }
    if (req.user.role === 'school_admin' && classroom.schoolId.toString() !== req.user.schoolId.toString()) {
      return res.status(403).json({ message: 'Unauthorized access to this classroom' });
    }
    await Classroom.findByIdAndDelete(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

