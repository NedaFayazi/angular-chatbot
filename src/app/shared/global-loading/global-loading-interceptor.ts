import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

import { GlobalLoadingService } from './global-loading-service';

/**
 * Set on an HTTP request's context to opt it out of the global loading
 * overlay, for requests that drive their own, more specific loading UI.
 */
export const SKIP_GLOBAL_LOADING = new HttpContextToken(() => false);

/**
 * Turns on the `GlobalLoadingService` overlay when a request starts, and
 * turns it off once the request completes, whether it succeeds or fails.
 * Requests carrying `SKIP_GLOBAL_LOADING` in their context are passed
 * through untouched.
 */
export const globalLoadingInterceptor: HttpInterceptorFn = (request, next) => {
  if (request.context.get(SKIP_GLOBAL_LOADING)) {
    return next(request);
  }

  const globalLoadingService = inject(GlobalLoadingService);

  globalLoadingService.show();

  return next(request).pipe(finalize(() => globalLoadingService.hide()));
};
