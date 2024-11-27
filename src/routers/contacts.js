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
import { upload } from '../middlewares/multer.js';

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
  upload.single('photo'),
  validateBody(addContactSchema),
  ctrlWrapper(contactsControllers.addContactController),
);

contactsRouter.patch(
  '/contacts/:id',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(contactsControllers.patchContactController),
);

contactsRouter.delete(
  '/contacts/:id',
  isValidId,
  ctrlWrapper(contactsControllers.deleteContactController),
);

export default contactsRouter;
