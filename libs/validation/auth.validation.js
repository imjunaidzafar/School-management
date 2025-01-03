import Joi from "joi";

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  role: Joi.string().valid('school_admin', 'student').required(),
  schoolName: Joi.string().when('role', {
    is: 'school_admin',
    then: Joi.required(),
    otherwise: Joi.forbidden()
  }),
  studentName: Joi.string().when('role', {
    is: 'student',
    then: Joi.required(),
    otherwise: Joi.forbidden()
  }),
  dateOfBirth: Joi.date().when('role', {
    is: 'student',
    then: Joi.required(),
    otherwise: Joi.forbidden()
  }),
});