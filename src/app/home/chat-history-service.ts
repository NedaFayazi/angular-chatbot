import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { ChatConversationResponse } from './model/chat-conversation-response';
import { ChatHistoryResponse } from './model/chat-history-response';

const CHAT_HISTORY_URL = '/api/get-chat-history';
const CHAT_CONVERSATION_URL = '/api/get-chat-conversation';

@Service()
export class ChatHistoryService {
  private readonly httpClient = inject(HttpClient);

  async getAllConversations() {
    const response = await firstValueFrom(
      this.httpClient.get<ChatHistoryResponse>(CHAT_HISTORY_URL),
    );

    return response.conversations;
  }

  async getConversationById(conversationId: string) {
    const response = await firstValueFrom(
      this.httpClient.get<ChatConversationResponse>(
        `${CHAT_CONVERSATION_URL}/${encodeURIComponent(conversationId)}`,
      ),
    );

    return response.conversation;
  }
}
