import {ChangeDetectionStrategy, Component, inject, linkedSignal, signal} from '@angular/core';
import {BreakpointObserver} from '@angular/cdk/layout';
import {Router} from '@angular/router';
import {httpResource} from "@angular/common/http";

import {SideNav} from './side-nav/side-nav';
import {InitialState} from './initial-state/initial-state';
import {ChatService} from './chat-service';
import {ChatMessage} from './model/chat-message';
import {Conversation} from './model/conversation';
import {ChatHistoryResponse} from './model/chat-history-response';
import {AuthService} from '../auth/auth-service';
import {UserProfileService} from '../shared/user-profile/user-profile-service';
import {ChatConversationResponse} from './model/chat-conversation-response';
import { ConversationThread } from './conversation-thread/conversation-thread';

@Component({
  selector: 'home',
  imports: [SideNav, InitialState, ConversationThread],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly chatService = inject(ChatService);
  private readonly authService = inject(AuthService);
  private readonly userProfileService = inject(UserProfileService);
  private readonly router = inject(Router);

  protected readonly sidebarCollapsed = signal(this.isBelowMdBreakpoint());
  protected readonly chatHistoryResponse = httpResource<ChatHistoryResponse>(() =>
    ('/api/get-chat-history'), {defaultValue: {conversations: []}});
  protected readonly selectConversations = httpResource<ChatConversationResponse>(() => this.activeConversationId() ? `/api/get-chat-conversation/${this.activeConversationId()}` : undefined);

  protected readonly newChatToken = signal(0);
  protected readonly isLoading = signal(false);
  protected readonly activeConversationId = signal<string | null>(null);

  protected readonly activeConversation = linkedSignal<Conversation | null>(() =>
    this.selectConversations.hasValue() ? this.selectConversations.value().conversation : null
  );
  protected readonly conversations = linkedSignal(() => this.chatHistoryResponse.value().conversations)

  protected toggleSidebar() {
    this.sidebarCollapsed.update(collapsed => !collapsed);
  }

  protected async selectConversation(conversationId: string) {
    if (this.isBelowMdBreakpoint()) {
      this.sidebarCollapsed.set(true);
    }
    this.activeConversationId.set(conversationId);
  }

  private isBelowMdBreakpoint() {
    return this.breakpointObserver.isMatched('(max-width: 48rem)');
  }

  protected startNewChat() {
    this.activeConversationId.set(null);
    this.activeConversation.set(null);
    this.newChatToken.update((token) => token + 1);
  }

  protected async sendMessage(text: string) {
    const message = text.trim();
    if (!message) {
      return;
    }

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
    };

    const activeConversation = this.activeConversation();
    this.isLoading.set(true);

    try {
      if (activeConversation) {
        this.addMessage(userMessage);
        const {reply} = await this.chatService.continueConversation(this.activeConversation()!.id, message);
        this.addMessage({id: crypto.randomUUID(), role: 'assistant', content: reply});
      } else {
        this.activeConversation.set({id: '', title: message.slice(0, 60), messages: [userMessage]});
        const {conversationId, reply} = await this.chatService.startConversation(message);
        this.activeConversation.update(conv => conv ? {...conv, id: conversationId} : conv);
        this.conversations.update(convs => [{id: conversationId, title: message.slice(0, 60), messages: []}, ...convs]);
        this.addMessage({id: crypto.randomUUID(), role: 'assistant', content: reply});
      }
    } catch {
      console.error('Something went wrong while getting a reply. Please try again in a few seconds.');
    } finally {
      this.isLoading.set(false);
    }
  }

  protected async logout() {
    this.authService.logout();
    this.userProfileService.clearProfile();
    await this.router.navigate(['/sign-in']);
  }

  private addMessage(message: ChatMessage) {
    this.activeConversation.update((conversation) =>
      conversation
        ? {...conversation, messages: [...conversation.messages, message]}
        : conversation,
    );
  }
}


