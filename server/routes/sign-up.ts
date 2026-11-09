import { Request, Response } from 'express';

import { signAccessToken } from '../auth/jwt';
import { addUser, findUserByEmail } from '../middleware/user-store';
import { delay } from '../delay';
import { logger } from '../logger';
import { AuthResponse } from '../model/auth-response';
import { UserProfile } from '../model/user-profile';

const CREATED = 201;
const BAD_REQUEST = 400;
const CONFLICT = 409;
const INTERNAL_ERROR = 500;

const MIN_PASSWORD_LENGTH = 8;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SIGN_UP_DELAY_MS = 800;

/**
 * Registers a new user from an email and password, stores it in the in-memory
 * data store with an Argon2id-hashed password, and returns the user profile
 * along with a signed HS256 JWT so the client is authenticated immediately.
 */
export async function signUp(request: Request, response: Response) {
  const { email, password } = request.body ?? {};

  logger.debug({ path: request.path }, 'Processing a sign-up request');

  await delay(SIGN_UP_DELAY_MS);

  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    !EMAIL_PATTERN.test(email.trim()) ||
    password.length < MIN_PASSWORD_LENGTH
  ) {
    logger.warn('Invalid sign-up request body');
    response.status(BAD_REQUEST).json({
      message: `A valid email and a password of at least ${MIN_PASSWORD_LENGTH} characters are required`,
    });
    return;
  }

  if (findUserByEmail(email)) {
    logger.warn({ email }, 'Sign-up failed: email already registered');
    response.status(CONFLICT).json({ message: 'An account with this email already exists' });
    return;
  }

  const user = await addUser(email, password);
  const profile: UserProfile = { id: user.id, email: user.email };

  let token: string;

  try {
    token = signAccessToken(profile);
  } catch (err) {
    logger.error({ err }, 'Failed to sign the authentication token');
    response.status(INTERNAL_ERROR).json({ message: 'Failed to complete sign-up' });
    return;
  }

  logger.info({ userId: user.id }, 'New user registered successfully');

  const body: AuthResponse = { user: profile, token };
  response.status(CREATED).json(body);
}
