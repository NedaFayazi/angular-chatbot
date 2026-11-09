/**
 * Shape returned by both the start-conversation and continue-conversation
 * backend endpoints: the id of the (new or existing) conversation and the
 * assistant reply text.
 */
export type ChatReplyResponse = {
  conversationId: string;
  reply: string;
};
