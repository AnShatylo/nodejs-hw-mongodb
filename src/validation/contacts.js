import Joi from 'joi';

import { contactTypeList } from '../constants/contacts.js';

export const addContactSchema = Joi.object({
  name: Joi.string().required().min(3).max(20).messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have at least {#limit} symbols',
    'string.max': 'Name should have at most {#limit} symbols',
    'any.required': 'Name is required',
  }),
  phoneNumber: Joi.string().required().min(3).max(20).messages({
    'string.base': 'Phone number should be a string',
    'string.min': 'Phone number should have at least {#limit} symbols',
    'string.max': 'Phone number should have at most {#limit} symbols',
    'any.required': 'Phone number is required',
  }),
  email: Joi.string().min(3).max(30).messages({
    'string.base': 'E-mail should be a string',
    'string.min': 'E-mail should have at least {#limit} symbols',
    'string.max': 'E-mail should have at most {#limit} symbols',
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': 'isFavorite should be true or false',
  }),
  contactType: Joi.string()
    .valid(...contactTypeList)
    .required()
    .messages({
      'any.only': `Contact type must be one of the following values: ${contactTypeList.join(
        ', ',
      )}`,
      'any.required': 'Contact type is required',
      'string.base': 'Contact type should be a string',
    }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have at least {#limit} symbols',
    'string.max': 'Name should have at most {#limit} symbols',
  }),
  phoneNumber: Joi.string().min(3).max(20).messages({
    'string.base': 'Phone number should be a string',
    'string.min': 'Phone number should have at least {#limit} symbols',
    'string.max': 'Phone number should have at most {#limit} symbols',
  }),
  email: Joi.string().min(3).max(30).messages({
    'string.base': 'E-mail should be a string',
    'string.min': 'E-mail should have at least {#limit} symbols',
    'string.max': 'E-mail should have at most {#limit} symbols',
  }),
  isFavorite: Joi.boolean().messages({
    'boolean.base': 'isFavorite should be true or false',
  }),
  contactType: Joi.string()
    .valid(...contactTypeList)
    .messages({
      'any.only': `Contact type must be one of the following values: ${contactTypeList.join(
        ', ',
      )}`,
      'string.base': 'Contact type should be a string',
    }),
});
