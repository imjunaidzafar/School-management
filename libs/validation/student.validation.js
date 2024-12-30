import Joi from 'joi';

export const createStudentSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  dateOfBirth: Joi.date().required(),
  schoolId: Joi.string().required(),
  classroomId: Joi.string(),
  enrollmentDate: Joi.date()
});

export const updateStudentSchema = Joi.object({
  firstName: Joi.string(),
  lastName: Joi.string(),
  dateOfBirth: Joi.date(),
  classroomId: Joi.string(),
}).min(1);

