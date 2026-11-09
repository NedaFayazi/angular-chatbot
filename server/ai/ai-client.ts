import { AiMessage } from '../model/ai-message.js';
import { logger } from '../logger';


const DEFAULT_API_URL = 'http://localhost:11434/v1/chat/completions';
const DEFAULT_MODEL = 'llama3.2';

type ChatCompletionResponse = {
  choices?: {
    message?: {
      content?: string;
    };
  }[];
};

/**
 * Sends a chat conversation to the configured AI provider using a plain HTTP
 * request (no vendor SDK) and returns the assistant reply text.
 *
 * The provider is configured entirely through environment variables so it can
 * be swapped without touching application code.
 */
export async function sendMessages(messages: AiMessage[]) {
  const apiKey = process.env['AI_API_KEY'];

  if (!apiKey) {
    throw new Error('The AI_API_KEY environment variable is not set');
  }

  const apiUrl = process.env['AI_API_URL'] ?? DEFAULT_API_URL;
  const model = process.env['AI_MODEL'] ?? DEFAULT_MODEL;

  logger.debug({ apiUrl, model, messageCount: messages.length }, 'Calling the AI provider');

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({ model, messages }),
  });

  logger.info(response, 'Calling response');

  if (!response.ok) {
    const errorBody = await response.text();
    logger.error(
      { status: response.status, errorBody },
      'The AI provider returned an error response',
    );
    throw new Error(`The AI provider request failed with status ${response.status}`);
  }

  const payload = (await response.json()) as ChatCompletionResponse;
  const reply = payload.choices?.[0]?.message?.content;

  if (!reply) {
    logger.error({ payload }, 'The AI provider response did not contain a reply');
    throw new Error('The AI provider response did not contain a reply');
  }

  return reply;
}
