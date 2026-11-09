import { NextFunction, Request, Response } from 'express';

import { verifyAccessToken } from '../auth/jwt';
import { logger } from '../logger';
import { UserProfile } from '../model/user-profile';


declare global {
  namespace Express {
    interface Request {
      user?: UserProfile;
    }
  }
}

const UNAUTHORIZED = 401;
const BEARER_PREFIX = 'Bearer ';

export function requireAuth(request: Request, response: Response, next: NextFunction) {
  const authorizationHeader = request.header('authorization');

  if (!authorizationHeader?.startsWith(BEARER_PREFIX)) {
    logger.warn({ path: request.path }, 'Rejected request without a Bearer token');
    response.status(UNAUTHORIZED).json({ message: 'Authentication required' });
    return;
  }

  const token = authorizationHeader.slice(BEARER_PREFIX.length).trim();

  try {
    request.user = verifyAccessToken(token);
  } catch (err) {
    logger.warn({ path: request.path, err }, 'Rejected request with an invalid access token');
    response.status(UNAUTHORIZED).json({ message: 'Invalid or expired access token' });
    return;
  }

  logger.debug({ path: request.path, userId: request.user.id }, 'Authenticated request');
  next();
}

/**
 * Reads the id of the authenticated user attached by `requireAuth`.
 *
 * Only call this from a route handler mounted behind `requireAuth` — it
 * throws otherwise, since that would signal the route is missing the guard.
 */
export function getAuthenticatedUserId(request: Request): string {
  if (!request.user) {
    throw new Error('getAuthenticatedUserId called on a request without requireAuth applied');
  }

  return request.user.id;
}
