import { inject, Service } from '@angular/core';
import { HttpClient, HttpContext } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { ChatReplyResponse } from './model/chat-reply-response';
import { SKIP_GLOBAL_LOADING } from '../shared/global-loading/global-loading-interceptor';

const ANGULAR_EXPERT_PROMPT_ID = 'angular-expert';

const skipLoading = {context : new HttpContext().set(SKIP_GLOBAL_LOADING, true)};

@Service()
export class ChatService {
  private readonly httpClient = inject(HttpClient);

  async startConversation(message: string) {
    return firstValueFrom(
      this.httpClient.post<ChatReplyResponse>(
        '/api/start-conversation',
        { promptId: ANGULAR_EXPERT_PROMPT_ID, message },
        skipLoading,
      ),
    );
  }

  async continueConversation(conversationId: string, message: string) {
    return firstValueFrom(
      this.httpClient.post<ChatReplyResponse>(
        '/api/continue-conversation',
        { conversationId, message },
        skipLoading,
      ),
    );
  }
}
