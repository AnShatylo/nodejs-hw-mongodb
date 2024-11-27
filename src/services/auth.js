import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import jwt from 'jsonwebtoken';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

import usersCollection from '../db/models/User.js';
import sessionCollection from '../db/models/Session.js';

import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/user.js';
import { SMTP, TEMPLATES_DIR } from '../constants/index.js';
import { env } from '../utils/env.js';
import { sendMail } from '../utils/sendMail.js';

export const registerUser = async (payload) => {
  const { name, email, password } = payload;

  const user = await usersCollection.findOne({ email });

  if (user) {
    throw createHttpError(409, 'Email in use');
  }

  const hashPassword = await bcrypt.hash(password, 10);

  return usersCollection.create({ ...payload, password: hashPassword });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: Date.now() + accessTokenLifetime,
    refreshTokenValidUntil: Date.now() + refreshTokenLifetime,
  };
};

export const userLogin = async ({ email, password }) => {
  const user = await usersCollection.findOne({ email });

  if (!user) {
    throw createHttpError(401, 'User not found!');
  }

  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw createHttpError(401, 'Wrong password');
  }

  await sessionCollection.deleteOne({ userId: user._id });

  const newSession = createSession();

  return sessionCollection.create({
    userId: user._id,
    ...newSession,
  });
};

export const refreshUserSession = async ({ sessionId, refreshToken }) => {
  const session = await sessionCollection.findOne({
    _id: sessionId,
    refreshToken,
  });

  if (!session) {
    throw createHttpError(401, 'Session is not found');
  }

  if (Date.now() > session.refreshTokenValidUntil) {
    throw createHttpError(401, 'Session token expired');
  }
  await sessionCollection.deleteOne({ _id: session._id });

  const newSession = createSession();

  return sessionCollection.create({
    userId: session.userId,
    ...newSession,
  });
};

export const userLogout = (sessionId) =>
  sessionCollection.deleteOne({ _id: sessionId });

export const findSession = (filter) => sessionCollection.findOne(filter);

export const findUser = (filter) => usersCollection.findOne(filter);

export const resetToken = async (email) => {
  const user = await usersCollection.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found!');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '15m',
    },
  );

  const resetPassTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSrc = (await fs.readFile(resetPassTemplatePath)).toString();

  const template = handlebars.compile(templateSrc);

  const html = template({
    name: user.name,
    link: `${env('APP_DOMAIN')}/reset-pwd?token=${resetToken}`,
  });

  try {
    await sendMail({
      from: env(SMTP.SMTP_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
};

export const resetPassword = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env('JWT_SECRET'));
  } catch (error) {
    if (error instanceof Error)
      throw createHttpError(401, 'Token is expired or invalid.');
    throw error;
  }

  const user = await usersCollection.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await usersCollection.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};
