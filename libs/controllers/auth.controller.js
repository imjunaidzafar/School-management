import User from '../models/user.model.js';
import { generateToken } from '../../config/jwt.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken(user);
    res.json({ token, role: user.role });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const register = async (req, res) => {
  try {
    const { email, password, role, schoolId, studentId } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user object based on role
    const userData = { email, password, role };
    if (role === 'school_admin' || role === 'student') {
      userData.schoolId = schoolId;
    }
    if (role === 'student') {
      userData.studentId = studentId;
    }

    // Create new user
    const newUser = new User(userData);
    await newUser.save();

    // Generate token
    const token = generateToken(newUser);

    res.status(201).json({ token, role: newUser.role });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};