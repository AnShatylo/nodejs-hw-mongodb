import express from 'express';
import cors from 'cors';
import { logger } from './middlewares/logger.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { errorHandler } from './middlewares/errorHandler.js';

import { env } from './utils/env.js';
import cookieParser from 'cookie-parser';

import contactsRouter from './routers/contacts.js';
import authRouter from './routers/auth.js';

export const startServer = () => {
  const app = express();

  app.use(cors());

  app.use(express.json());
  app.use(cookieParser());

  app.use(logger);

  app.use('/auth', authRouter);
  app.use('/', contactsRouter);

  app.use(notFoundHandler);

  app.use(errorHandler);

  const port = Number(env('PORT', 3000));

  app.listen(port, () => console.log(`Server is running on port ${port}`));
};
