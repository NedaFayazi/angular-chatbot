import { Subject } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { type Event as RouterEvent, NavigationEnd, NavigationStart, Router } from '@angular/router';

import { GlobalLoading } from './global-loading';
import { GlobalLoadingService } from './global-loading-service';

describe('GlobalLoading', () => {
  let routerEvents: Subject<RouterEvent>;

  function createComponent() {
    routerEvents = new Subject<RouterEvent>();

    TestBed.configureTestingModule({
      providers: [
        provideZonelessChangeDetection(),
        { provide: Router, useValue: { events: routerEvents.asObservable() } },
      ],
    });

    const fixture = TestBed.createComponent(GlobalLoading);
    fixture.detectChanges();
    return fixture;
  }

  function hasOverlay(fixture: ReturnType<typeof createComponent>) {
    return fixture.nativeElement.querySelector('.global-loading-overlay') !== null;
  }

  it('is hidden when no navigation is running', () => {
    const fixture = createComponent();
    expect(hasOverlay(fixture)).toBe(false);
  });

  it('shows the loading indicator while a router navigation is in progress', () => {
    const fixture = createComponent();

    routerEvents.next(new NavigationStart(1, '/home'));
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('.global-loading-overlay');
    expect(overlay).not.toBeNull();
    expect(overlay.querySelector('loading-indicator')).not.toBeNull();
  });

  it('hides the indicator once the navigation finishes', () => {
    const fixture = createComponent();

    routerEvents.next(new NavigationStart(1, '/home'));
    fixture.detectChanges();
    routerEvents.next(new NavigationEnd(1, '/home', '/home'));
    fixture.detectChanges();

    expect(hasOverlay(fixture)).toBe(false);
  });

  it('can also be driven by GlobalLoadingService', () => {
    const fixture = createComponent();
    const loadingService = TestBed.inject(GlobalLoadingService);

    loadingService.show();
    fixture.detectChanges();
    expect(hasOverlay(fixture)).toBe(true);

    loadingService.hide();
    fixture.detectChanges();
    expect(hasOverlay(fixture)).toBe(false);
  });
});
