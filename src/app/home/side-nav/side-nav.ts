import {ChangeDetectionStrategy, Component, computed, inject, input, output, signal} from '@angular/core';
import { form, FormField } from '@angular/forms/signals';

import { AngularLogo } from '../angular-logo/angular-logo';
import { ChatHistory } from '../chat-history/chat-history';
import { Conversation } from '../model/conversation';
import { ConversationSearch } from '../model/conversation-search';
import {UserProfileService} from '../../shared/user-profile/user-profile-service';

@Component({
  selector: 'side-nav',
  imports: [AngularLogo, ChatHistory, FormField],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class:
      'block h-full shrink-0 overflow-hidden border-r border-[var(--color-border)] bg-[var(--color-sidebar-bg)] transition-[width] duration-200 max-md:fixed max-md:top-0 max-md:left-0 max-md:z-50 max-md:shadow-[var(--shadow-panel)]',
    '[style.width]':
      'collapsed() ? "var(--sidebar-width-collapsed)" : "var(--sidebar-width)"',
  },
})
export class SideNav {
  readonly collapsed = input.required<boolean>();
  readonly conversations = input.required<Conversation[]>();
  readonly activeConversationId = input.required<string | null>();
  private readonly userProfileService = inject(UserProfileService);

  protected readonly profile = this.userProfileService.profile;
  protected readonly searchOpen = signal(false);
  private readonly searchModel = signal<ConversationSearch>({ query: '' });
  protected readonly displayName = computed(
    () => this.profile()?.email.split('@')[0] ?? '',
  );
  protected readonly initial = computed(
    () => this.displayName().charAt(0).toUpperCase(),
  );
  readonly toggleCollapsed = output<void>();
  readonly newChat = output<void>();
  readonly search = output<void>();
  readonly selectConversation = output<string>();
  readonly logout = output<void>();


  protected readonly searchForm = form(this.searchModel);
  protected readonly visibleConversations = computed(() => {
    const query = this.searchModel().query.trim().toLowerCase();
    if (!query) {
      return this.conversations();
    }
    return this.conversations().filter((conversation) =>
      conversation.title.toLowerCase().includes(query),
    );
  });

  protected toggleSearch() {
    const open = !this.searchOpen();
    this.searchOpen.set(open);
    this.search.emit();
    if (!open) {
      this.searchModel.set({ query: '' });
    }
  }
}
