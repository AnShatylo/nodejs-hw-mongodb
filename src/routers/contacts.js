import { Router } from 'express';

import * as contactsControllers from '../controllers/contacts.js';
import ctrlWrapper from '../utils/ctrlWrapper.js';

const contactsRouter = Router();

contactsRouter.get(
  '/contacts',
  ctrlWrapper(contactsControllers.getContactsController),
);

contactsRouter.get(
  '/contacts/:id',
  ctrlWrapper(contactsControllers.getContactByIdController),
);

contactsRouter.post(
  '/contacts',
  ctrlWrapper(contactsControllers.addContactController),
);

contactsRouter.patch(
  '/contacts/:id',
  ctrlWrapper(contactsControllers.patchContactController),
);

contactsRouter.delete(
  '/contacts/:id',
  ctrlWrapper(contactsControllers.deleteContactController),
);

export default contactsRouter;
