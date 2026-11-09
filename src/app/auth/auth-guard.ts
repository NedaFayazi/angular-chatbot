import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { UserProfileService } from '../shared/user-profile/user-profile-service';

/**
 * Blocks navigation to routes that require a signed-in user, redirecting to
 * the sign-in screen when `UserProfileService` has no stored profile.
 */
export const authGuard: CanActivateFn = () => {
  const userProfileService = inject(UserProfileService);
  const router = inject(Router);

  if (userProfileService.profile()) {
    return true;
  }

  return router.createUrlTree(['/sign-in']);
};
