import {
  afterRenderEffect,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { form, FormField, requiredError, submit, validate } from '@angular/forms/signals';

import { AngularLogo } from '../angular-logo/angular-logo';
import { Conversation } from '../model/conversation';
import { MessageForm } from '../model/message-form';

@Component({
  selector: 'conversation-thread',
  imports: [AngularLogo, FormField],
  templateUrl: './conversation-thread.html',
  styleUrl: './conversation-thread.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex min-h-0 flex-1 flex-col',
  },
})
export class ConversationThread {
  readonly conversation = input.required<Conversation>();
  readonly isLoading = input(false);

  readonly sendMessage = output<string>();

  private readonly scrollContainer =
    viewChild.required<ElementRef<HTMLElement>>('scrollContainer');

  private readonly messageModel = signal<MessageForm>({ text: '' });

  protected readonly messageForm = form(this.messageModel, (path) => {
    validate(path.text, (context) => (context.value().trim() ? undefined : requiredError()));
  });
  protected lastMessageCount = 0;
  private wasLoading = false;

  constructor() {
    afterRenderEffect(() => {
      const messageCount = this.conversation().messages.length;
      const loading = this.isLoading();
      if (messageCount !== this.lastMessageCount || loading !== this.wasLoading) {
        this.lastMessageCount = messageCount;
        this.wasLoading = loading;
        const element = this.scrollContainer().nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    });
  }

  protected async onSubmit(event: Event) {
    event.preventDefault();
    if (this.isLoading()) {
      return;
    }
    await submit(this.messageForm, async (submitted) => {
      this.sendMessage.emit(submitted.text().value().trim());
      this.messageForm().reset({ text: '' });
    });
  }
}
