import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().required().min(3).messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have at least {#limit} symbols',
    'any.required': 'Name is required',
  }),
  email: Joi.string().required().min(3).max(30).messages({
    'string.base': 'E-mail should be a string',
    'string.min': 'E-mail should have at least {#limit} symbols',
    'string.max': 'E-mail should have at most {#limit} symbols',
    'any.required': 'E-mail is required',
  }),
  password: Joi.string().required().messages({
    'string.base': 'Password should be a string',
    'any.required': 'Password is required',
  }),
});

export const loginSchema = Joi.object({
  email: Joi.string().required().min(3).max(30).messages({
    'string.base': 'E-mail should be a string',
    'string.min': 'E-mail should have at least {#limit} symbols',
    'string.max': 'E-mail should have at most {#limit} symbols',
    'any.required': 'E-mail is required',
  }),
  password: Joi.string().required().messages({
    'string.base': 'Password should be a string',
    'any.required': 'Password is required',
  }),
});
