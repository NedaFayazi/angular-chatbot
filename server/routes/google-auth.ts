import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';

import { signAccessToken } from '../auth/jwt';
import { logger } from '../logger';
import { AuthResponse } from '../model/auth-response';
import { UserProfile } from '../model/user-profile';
import { addUserWithoutPassword, findUserByEmail } from '../middleware/user-store';

const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const INTERNAL_ERROR = 500;

const googleClientId = process.env['GOOGLE_CLIENT_ID'];
const googleClient = new OAuth2Client(googleClientId);

/**
 * Signs a user in with a Google ID token sent by the client. The token is
 * verified against Google's public keys, then the user is found by email (or
 * created on first login) and the same AuthResponse as sign-in is returned.
 */
export async function googleAuth(request: Request, response: Response) {
  const { idToken } = request.body ?? {};
  logger.warn(googleClientId);

  if (!googleClientId) {
    logger.error('GOOGLE_CLIENT_ID is not configured');
    response.status(INTERNAL_ERROR).json({ message: 'Google sign-in is not available' });
    return;
  }

  if (typeof idToken !== 'string' || idToken.length === 0) {
    logger.warn('Invalid Google sign-in request body');
    response.status(BAD_REQUEST).json({ message: 'An idToken is required' });
    return;
  }

  let email: string | undefined;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: googleClientId,
    });
    const payload = ticket.getPayload();

    if (payload?.email_verified) {
      email = payload.email;
    }
  } catch (err) {
    logger.warn({ err }, 'Google ID token verification failed');
  }

  if (!email) {
    response.status(UNAUTHORIZED).json({ message: 'Invalid Google account' });
    return;
  }

  const user = findUserByEmail(email) ?? addUserWithoutPassword(email);
  const profile: UserProfile = { id: user.id, email: user.email };

  let token: string;

  try {
    token = signAccessToken(profile);
  } catch (err) {
    logger.error({ err }, 'Failed to sign the authentication token');
    response.status(INTERNAL_ERROR).json({ message: 'Failed to complete sign-in' });
    return;
  }

  logger.info({ userId: user.id }, 'User signed in with Google');

  const body: AuthResponse = { user: profile, token };
  response.json(body);
}
