import { computed, Service, signal } from '@angular/core';

/**
 * Stateful, signals-based switch for the app-wide <global-loading> overlay.
 * Any screen can inject this service and call show()/hide() around an async task.
 * Calls are reference-counted, so overlapping callers each keep the overlay up
 * until they have all finished.
 */
@Service()
export class GlobalLoadingService {
  private readonly pendingTasks = signal(0);

  readonly loading = computed(() => this.pendingTasks() > 0);

  show() {
    this.pendingTasks.update((count) => count + 1);
  }

  hide() {
    this.pendingTasks.update((count) => Math.max(0, count - 1));
  }
}
