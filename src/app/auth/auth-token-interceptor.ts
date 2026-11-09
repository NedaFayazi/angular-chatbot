import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';

import { AuthService } from './auth-service';

/**
 * Appends the JWT stored by `AuthService`, if any, as a `Bearer` token on the
 * `Authorization` header of every outgoing request.
 */
export const authTokenInterceptor: HttpInterceptorFn = (request, next) => {
  const authService = inject(AuthService);
  const token = authService.readToken();
  if (!token) {
    return next(request);
  }
  return next(
    request.clone({
      setHeaders: { Authorization: `Bearer ${token}` },
    }),
  );
};
