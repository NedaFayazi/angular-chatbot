import { randomUUID } from 'node:crypto';

import { Request, Response } from 'express';

import { sendMessages } from '../ai/ai-client';
import { logger } from '../logger';
import { getAuthenticatedUserId } from '../middleware/require-auth';
import { ChatMessage } from '../model/chat-message';
import { getPromptById } from '../prompts';
import {addConversation} from '../middleware/conversation-store';

const BAD_REQUEST = 400;
const UNKNOWN_PROMPT = 404;
const AI_PROVIDER_ERROR = 502;
const MAX_TITLE_LENGTH = 80;

export async function startConversation(request: Request, response: Response) {
  const userId = getAuthenticatedUserId(request);
  const { promptId, message } = request.body ?? {};

  logger.debug({ path: request.path, promptId }, 'Starting a new conversation');

  if (
    typeof promptId !== 'string' ||
    typeof message !== 'string' ||
    message.trim().length === 0
  ) {
    logger.warn({ promptId }, 'Invalid start-conversation request body');
    response
      .status(BAD_REQUEST)
      .json({ message: 'A promptId and a non-empty message are required' });
    return;
  }

  const prompt = getPromptById(promptId);
  logger.warn({ promptId }, 'we have it');
  if (!prompt) {
    response.status(UNKNOWN_PROMPT).json({ message: 'Unknown promptId' });
    return;
  }

  logger.debug({ promptId }, 'Requesting the initial reply from the AI provider');

  let reply: string;

  try {
    reply = await sendMessages([
      { role: 'system', content: prompt.systemPrompt },
      { role: 'user', content: message },
    ]);
  } catch (err) {
    logger.error({ err, promptId }, 'Failed to get a reply from the AI provider');
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

  const conversation = addConversation({
    userId,
    title: message.slice(0, MAX_TITLE_LENGTH),
    promptId,
    messages: [userMessage, assistantMessage],
  });

  logger.info(
    { conversationId: conversation.id, userId, promptId, replyLength: reply.length },
    'New conversation started and stored',
  );

  response.json({ conversationId: conversation.id, reply });
}
