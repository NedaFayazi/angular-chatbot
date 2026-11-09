import { ChatMessage } from './chat-message';

export type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
};
