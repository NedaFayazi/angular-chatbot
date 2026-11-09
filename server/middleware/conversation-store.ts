/// <reference types="node" />
import {randomUUID} from 'node:crypto';

import {ChatMessage} from '../model/chat-message';
import {Conversation} from '../model/conversation';
import {conversations} from '../db-data';

type NewConversation = {
  userId: string;
  title: string;
  promptId: string;
  messages: ChatMessage[];
};

/**
 * Creates a conversation with a fresh id and stores it in the in-memory DB.
 * The system prompt is deliberately not stored: the conversation is linked to
 * it only through `promptId`.
 */
export function addConversation(newConversation: NewConversation) {
  const conversation: Conversation = {
    id: randomUUID(),
    userId: newConversation.userId,
    title: newConversation.title,
    promptId: newConversation.promptId,
    messages: newConversation.messages,
  };

  conversations.push(conversation);

  return conversation;
}

export function getConversationById(conversationId: string) {
  return conversations.find((conversation) => conversation.id === conversationId);
}

export function getConversationsForUser(userId: string) {
  return conversations.filter((conversation) => conversation.userId === userId);
}
