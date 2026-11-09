import { ChatMessage } from './chat-message';

export type Conversation = {
  id: string;
  userId: string;
  title: string;
  promptId: string;
  messages: ChatMessage[];
};
