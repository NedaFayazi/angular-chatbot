import {Request, Response} from 'express';

import {signAccessToken} from '../auth/jwt';
import {getDummyPasswordHash, verifyPassword} from '../auth/password-hasher';
import {delay} from '../delay';
import {logger} from '../logger';
import {AuthResponse} from '../model/auth-response';
import {UserProfile} from '../model/user-profile';
import {findUserByEmail} from '../middleware/user-store';

const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const INTERNAL_ERROR = 500;

const SIGN_IN_DELAY_MS = 800;

/**
 * Authenticates a user from an email and password.
 *
 * On success the response carries the user profile and a signed HS256 JWT.
 * Failed lookups still run a password verification against a dummy hash so the
 * response time does not reveal whether the email belongs to a real account.
 */
export async function signIn(request: Request, response: Response) {
  const {email, password} = request.body ?? {};

  logger.debug({path: request.path}, 'Processing a sign-in request');

  await delay(SIGN_IN_DELAY_MS);

  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    email.trim().length === 0 ||
    password.length === 0
  ) {
    logger.warn('Invalid sign-in request body');
    response.status(BAD_REQUEST).json({message: 'An email and a password are required'});
    return;
  }

  const user = findUserByEmail(email);
  const passwordHashToCheck = user?.passwordHash ?? (await getDummyPasswordHash());
  const passwordMatches = await verifyPassword(passwordHashToCheck, password);

  if (!user || !passwordMatches) {
    logger.warn({email}, 'Sign-in failed: invalid credentials');
    response.status(UNAUTHORIZED).json({message: 'Invalid email or password'});
    return;
  }

  const profile: UserProfile = {id: user.id, email: user.email};

  let token: string;

  try {
    token = signAccessToken(profile);
  } catch (err) {
    logger.error({err}, 'Failed to sign the authentication token');
    response.status(INTERNAL_ERROR).json({message: 'Failed to complete sign-in'});
    return;
  }

  logger.info({userId: user.id}, 'User signed in successfully');

  const body: AuthResponse = {user: profile, token};
  response.json(body);
}
