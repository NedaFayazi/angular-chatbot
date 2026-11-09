import { Request, Response } from 'express';

import { logger } from '../logger';
import { getAuthenticatedUserId } from '../middleware/require-auth';
import {getConversationById} from '../middleware/conversation-store';

const NOT_FOUND = 404;

export function getChatConversation(request: Request, response: Response) {
  const userId = getAuthenticatedUserId(request);
  const conversationIdParam = request.params['id'];
  const conversationId = Array.isArray(conversationIdParam)
    ? conversationIdParam[0]
    : conversationIdParam;

  logger.debug(
    { path: request.path, conversationId, userId },
    'Retrieving a single conversation from the in-memory DB',
  );

  const conversation = getConversationById(conversationId);

  if (!conversation || conversation.userId !== userId) {
    logger.warn({ conversationId, userId }, 'Conversation not found');
    response.status(NOT_FOUND).json({ message: 'Conversation not found' });
    return;
  }

  const visibleMessages = conversation.messages.filter((message) => message.role !== 'system');

  logger.info(
    {
      conversationId,
      totalMessages: conversation.messages.length,
      visibleMessages: visibleMessages.length,
    },
    'Conversation retrieved',
  );

  response.json({
    conversation: { ...conversation, messages: visibleMessages },
  });
}
