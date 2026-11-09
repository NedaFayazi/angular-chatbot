import { ChangeDetectionStrategy, Component, input, linkedSignal, output } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { form, FormField, requiredError, submit, validate } from '@angular/forms/signals';

import { MessageForm } from '../model/message-form';

@Component({
  selector: 'initial-state',
  imports: [NgOptimizedImage, FormField],
  templateUrl: './initial-state.html',
  styleUrl: './initial-state.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'flex flex-1 items-center justify-center p-6',
  },
})
export class InitialState {
  readonly sendMessage = output<string>();

  readonly resetToken = input(0);

  private readonly messageModel = linkedSignal<MessageForm>(() => {
    this.resetToken();
    return { text: '' };
  });

  protected readonly messageForm = form(this.messageModel, (path) => {
    validate(path.text, (context) => (context.value().trim() ? undefined : requiredError()));
  });

  protected async onSubmit(event: Event) {
    event.preventDefault();
    await submit(this.messageForm, async (submitted) => {
      this.sendMessage.emit(submitted.text().value().trim());
      this.messageForm().reset({ text: '' });
    });
  }
}
