import { HttpErrorResponse } from '@angular/common/http';

/**
 * Extracts a user-facing message from a failed auth request, falling back to
 * `fallbackMessage` when the server response didn't carry one.
 */
export function authErrorMessage(error: unknown, fallbackMessage: string) {
  if (error instanceof HttpErrorResponse) {
    const body = error.error as { message?: unknown } | null;
    if (body && typeof body.message === 'string') {
      return body.message;
    }
  }
  return fallbackMessage;
}
