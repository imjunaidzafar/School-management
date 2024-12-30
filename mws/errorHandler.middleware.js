import Joi from 'joi';
import mongoose from 'mongoose';

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err instanceof Joi.ValidationError) {
    return res.status(400).json({ message: err.details[0].message });
  }

  if (err instanceof mongoose.Error.CastError) {
    return res.status(400).json({ message: 'Invalid ID format' });
  }

  if (err instanceof mongoose.Error.ValidationError) {
    const errors = Object.values(err.errors).map(error => error.message);
    return res.status(400).json({ message: errors.join(', ') });
  }

  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  res.status(500).json({ message: 'Internal server error' });
};

