import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationSkipped,
  NavigationStart,
  Router,
} from '@angular/router';
import { filter, map } from 'rxjs';

import { LoadingIndicator } from '../loading-indicator/loading-indicator';
import { GlobalLoadingService } from './global-loading-service';

@Component({
  selector: 'global-loading',
  imports: [LoadingIndicator],
  templateUrl: './global-loading.html',
  styleUrl: './global-loading.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalLoading {
  private readonly router = inject(Router);
  private readonly globalLoadingService = inject(GlobalLoadingService);

  private readonly routerNavigating = toSignal(
    this.router.events.pipe(
      filter(
        (event) =>
          event instanceof NavigationStart ||
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError ||
          event instanceof NavigationSkipped,
      ),
      map((event) => event instanceof NavigationStart),
    ),
    { initialValue: false },
  );

  protected readonly visible = computed(
    () => this.routerNavigating() || this.globalLoadingService.loading(),
  );
}
