import Joi from 'joi';

import { contactTypeList } from '../constants/contacts.js';

export const addContactSchema = Joi.object({
  name: Joi.string().required().min(3).max(20),
  phoneNumber: Joi.string().required().min(3).max(20),
  email: Joi.string().min(3).max(20),
  isFavorite: Joi.boolean(),
  contactType: Joi.string()
    .valid(...contactTypeList)
    .required(),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20),
  phoneNumber: Joi.string().min(3).max(20),
  email: Joi.string().min(3).max(20),
  isFavorite: Joi.boolean(),
  contactType: Joi.string()
    .valid(...contactTypeList)
    .required(),
});
