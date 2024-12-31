import School from '../models/school.model.js';

export const createSchool = async (req, res) => {
  try {
    const school = await School.create(req.body);
    res.status(201).json(school);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'School with this email already exists' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSchools = async (req, res) => {
  try {
    const schools = await School.find();
    res.json(schools);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSchool = async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    res.json(school);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateSchool = async (req, res) => {
  try {
    const school = await School.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    
    res.json(school);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteSchool = async (req, res) => {
  try {
    const school = await School.findByIdAndDelete(req.params.id);
    if (!school) {
      return res.status(404).json({ message: 'School not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

