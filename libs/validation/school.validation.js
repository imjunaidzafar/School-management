import Joi from 'joi';

export const createSchoolSchema = Joi.object({
  name: Joi.string().required(),
  address: Joi.string().required(),
  contactNumber: Joi.string().required(),
  email: Joi.string().email().required()
});

export const updateSchoolSchema = Joi.object({
  name: Joi.string(),
  address: Joi.string(),
  contactNumber: Joi.string(),
  email: Joi.string().email()
}).min(1);

