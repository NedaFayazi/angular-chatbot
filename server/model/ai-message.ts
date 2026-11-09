export type AiMessageRole = 'system' | 'user' | 'assistant';

/**
 * The message shape expected by the AI provider HTTP API. It intentionally has
 * no id, so it is kept separate from the stored ChatMessage model.
 */
export type AiMessage = {
  role: AiMessageRole;
  content: string;
};
