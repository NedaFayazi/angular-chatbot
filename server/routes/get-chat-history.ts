import { Request, Response } from 'express';

import { logger } from '../logger';
import { getAuthenticatedUserId } from '../middleware/require-auth';
import {getConversationsForUser} from '../middleware/conversation-store';

export function getChatHistory(request: Request, response: Response) {
  const userId = getAuthenticatedUserId(request);

  logger.debug({ path: request.path, userId }, 'Retrieving chat history from the in-memory DB');

  const conversations = getConversationsForUser(userId);

  response.json({ conversations });

  logger.info(
    { userId, conversationCount: conversations.length },
    'Chat history returned to the client',
  );
}
