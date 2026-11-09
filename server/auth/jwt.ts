import jwt from 'jsonwebtoken';

import { UserProfile } from '../model/user-profile';

const JWT_ALGORITHM = 'HS256';
const JWT_EXPIRES_IN_SECONDS = 60 * 60;

function getJwtSecret() {
  const secret = process.env['JWT_SECRET'];

  if (!secret) {
    throw new Error('The JWT_SECRET environment variable is not set');
  }

  return secret;
}

export function signAccessToken(profile: UserProfile) {
  return jwt.sign({ email: profile.email }, getJwtSecret(), {
    algorithm: JWT_ALGORITHM,
    subject: profile.id,
    expiresIn: JWT_EXPIRES_IN_SECONDS,
  });
}

export function verifyAccessToken(token: string) {
  const payload = jwt.verify(token, getJwtSecret(), { algorithms: [JWT_ALGORITHM] });

  if (
    typeof payload === 'string' ||
    typeof payload.sub !== 'string' ||
    typeof payload['email'] !== 'string'
  ) {
    throw new Error('The access token payload is malformed');
  }

  const profile: UserProfile = { id: payload.sub, email: payload['email'] };
  return profile;
}
