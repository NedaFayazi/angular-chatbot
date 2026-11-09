import { randomUUID } from 'node:crypto';

import { Request, Response } from 'express';

import { sendMessages } from '../ai/ai-client';
import { logger } from '../logger';
import { getAuthenticatedUserId } from '../middleware/require-auth';
import { AiMessage } from '../model/ai-message';
import { ChatMessage } from '../model/chat-message';
import { getPromptById } from '../prompts';
import {getConversationById} from '../middleware/conversation-store';

const BAD_REQUEST = 400;
const CONVERSATION_NOT_FOUND = 404;
const AI_PROVIDER_ERROR = 502;

/**
 * Continues an existing conversation.
 *
 * The request body carries the `conversationId` and the next user `message`.
 * The stored conversation is retrieved, its backend-only system prompt is
 * prepended, the full history plus the new message is sent to the AI provider,
 * and the new user/assistant messages are appended to the in-memory store.
 */
export async function continueConversation(request: Request, response: Response) {
  const userId = getAuthenticatedUserId(request);
  const { conversationId, message } = request.body ?? {};

  logger.debug({ path: request.path, conversationId }, 'Continuing a conversation');

  if (
    typeof conversationId !== 'string' ||
    typeof message !== 'string' ||
    message.trim().length === 0
  ) {
    logger.warn({ conversationId }, 'Invalid continue-conversation request body');
    response
      .status(BAD_REQUEST)
      .json({ message: 'A conversationId and a non-empty message are required' });
    return;
  }

  const conversation = getConversationById(conversationId);

  if (!conversation || conversation.userId !== userId) {
    logger.warn({ conversationId, userId }, 'Conversation not found');
    response.status(CONVERSATION_NOT_FOUND).json({ message: 'Conversation not found' });
    return;
  }

  const prompt = getPromptById(conversation.promptId);

  if (!prompt) {
    logger.error(
      { conversationId, promptId: conversation.promptId },
      'Conversation is linked to an unknown prompt',
    );
    response
      .status(AI_PROVIDER_ERROR)
      .json({ message: 'Failed to get a reply from the AI provider' });
    return;
  }

  const conversationForAi: AiMessage[] = [
    { role: 'system', content: prompt.systemPrompt },
    ...conversation.messages.map((chatMessage) => ({
      role: chatMessage.role,
      content: chatMessage.content,
    })),
    { role: 'user', content: message },
  ];

  logger.debug(
    { conversationId, messageCount: conversationForAi.length },
    'Requesting the next reply from the AI provider',
  );

  let reply: string;

  try {
    reply = await sendMessages(conversationForAi);
  } catch (err) {
    logger.error({ err, conversationId }, 'Failed to get a reply from the AI provider');
    response
      .status(AI_PROVIDER_ERROR)
      .json({ message: 'Failed to get a reply from the AI provider' });
    return;
  }

  const userMessage: ChatMessage = {
    id: randomUUID(),
    role: 'user',
    content: message,
  };

  const assistantMessage: ChatMessage = {
    id: randomUUID(),
    role: 'assistant',
    content: reply,
  };

  conversation.messages.push(userMessage, assistantMessage);

  logger.info(
    { conversationId, messageCount: conversation.messages.length, replyLength: reply.length },
    'Conversation continued and stored',
  );

  response.json({ conversationId, reply });
}
