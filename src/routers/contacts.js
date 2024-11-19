import { Router } from 'express';

import * as contactsControllers from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import {
  addContactSchema,
  updateContactSchema,
} from '../validation/contacts.js';

import { isValidId } from '../middlewares/isValidId.js';

const contactsRouter = Router();

contactsRouter.use(authenticate);

contactsRouter.get(
  '/contacts',
  ctrlWrapper(contactsControllers.getContactsController),
);

contactsRouter.get(
  '/contacts/:id',
  isValidId,
  ctrlWrapper(contactsControllers.getContactByIdController),
);

contactsRouter.post(
  '/contacts',
  validateBody(addContactSchema),
  ctrlWrapper(contactsControllers.addContactController),
);

contactsRouter.patch(
  '/contacts/:id',
  isValidId,
  validateBody(updateContactSchema),
  ctrlWrapper(contactsControllers.patchContactController),
);

contactsRouter.delete(
  '/contacts/:id',
  ctrlWrapper(isValidId, contactsControllers.deleteContactController),
);

export default contactsRouter;
