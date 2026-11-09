import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { UserMessageKind } from './user-message';
import { UserMessagesService } from './user-messages-service';

@Component({
  selector: 'user-messages',
  templateUrl: './user-messages.html',
  styleUrl: './user-messages.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserMessages {
  private readonly userMessagesService = inject(UserMessagesService);

  protected readonly messages = this.userMessagesService.messages;

  protected readonly kindHeadings: Record<UserMessageKind, string> = {
    error: 'Something went wrong',
    warning: 'Warning',
    info: 'Information',
    success: 'Success',
  };

  protected dismiss(messageId: string) {
    this.userMessagesService.dismiss(messageId);
  }
}
