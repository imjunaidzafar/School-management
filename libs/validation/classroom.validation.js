import Joi from 'joi';

export const createClassroomSchema = Joi.object({
  name: Joi.string().required(),
  capacity: Joi.number().required().min(1),
  schoolId: Joi.string().required(),
  resources: Joi.array().items(Joi.string())
});

export const updateClassroomSchema = Joi.object({
  name: Joi.string(),
  capacity: Joi.number().min(1),
  resources: Joi.array().items(Joi.string())
}).min(1);

