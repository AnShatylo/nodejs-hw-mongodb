import createHttpError from 'http-errors';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';

import usersCollection from '../db/models/User.js';
import sessionCollection from '../db/models/Session.js';

import {
  accessTokenLifetime,
  refreshTokenLifetime,
} from '../constants/user.js';

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
