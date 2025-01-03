import Joi from 'joi';
import mongoose from 'mongoose';

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  let statusCode = 500;
  let errorMessage = 'Internal server error';
  let errorDetails = null;

  // Handle JSON parsing errors
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    statusCode = 400;
    errorMessage = 'Invalid JSON format';
    errorDetails = {
      type: 'JsonParseError',
      message: 'The request body contains invalid JSON'
    };
  }
  // Handle validation errors
  else if (err instanceof Joi.ValidationError) {
    statusCode = 400;
    errorMessage = 'Validation error';
    errorDetails = err.details.map(detail => ({
      field: detail.context.key,
      message: detail.message
    }));
  }
  // Handle MongoDB invalid ID format
  else if (err instanceof mongoose.Error.CastError) {
    statusCode = 400;
    errorMessage = 'Invalid ID format';
    errorDetails = {
      field: err.path,
      value: err.value
    };
  }
  // Handle MongoDB validation errors
  else if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    errorMessage = 'Validation error';
    errorDetails = Object.values(err.errors).map(error => ({
      field: error.path,
      message: error.message
    }));
  }
  // Handle JWT authentication errors
  else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    errorMessage = 'Invalid token';
  }
  // Handle forbidden access
  else if (err.name === 'ForbiddenError') {
    statusCode = 403;
    errorMessage = 'Access forbidden';
  }
  // Handle not found errors
  else if (err.name === 'NotFoundError') {
    statusCode = 404;
    errorMessage = 'Resource not found';
  }

  // Send the error response
  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    details: errorDetails,
    // Only include stack trace in development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

// Express JSON parsing error handler middleware
export const jsonParsingErrorHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format',
      details: {
        type: 'JsonParseError',
        message: 'The request body contains invalid JSON'
      }
    });
  }
  next(err);
};

