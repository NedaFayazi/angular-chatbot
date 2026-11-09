import { Service, signal } from '@angular/core';

import { UserMessage, UserMessageKind } from './user-message';

@Service()
export class UserMessagesService {
  private readonly userMessages = signal<UserMessage[]>([]);

  readonly messages = this.userMessages.asReadonly();

  showError(text: string) {
    return this.addMessage('error', text);
  }

  showWarning(text: string) {
    return this.addMessage('warning', text);
  }

  showInfo(text: string) {
    return this.addMessage('info', text);
  }

  showSuccess(text: string) {
    return this.addMessage('success', text);
  }

  dismiss(messageId: string) {
    this.userMessages.update((messages) =>
      messages.filter((message) => message.id !== messageId),
    );
  }

  clearAll() {
    this.userMessages.set([]);
  }

  private addMessage(kind: UserMessageKind, text: string) {
    const message: UserMessage = { id: crypto.randomUUID(), kind, text };
    this.userMessages.update((messages) => [...messages, message]);
    return message.id;
  }
}
