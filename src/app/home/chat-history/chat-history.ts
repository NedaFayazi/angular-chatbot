import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

import { Conversation } from '../model/conversation';

@Component({
  selector: 'chat-history',
  templateUrl: './chat-history.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatHistory {
  readonly conversations = input.required<Conversation[]>();
  readonly activeConversationId = input.required<string | null>();

  readonly selectConversation = output<string>();
}
