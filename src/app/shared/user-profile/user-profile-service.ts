import { Service, signal } from '@angular/core';

import { UserProfile } from './user-profile';

const USER_PROFILE_STORAGE_KEY = 'user-profile';
const TOKEN_KEY = 'token';

@Service()
export class UserProfileService {
  private readonly userProfile = signal<UserProfile | null>(this.readStoredProfile());

  readonly profile = this.userProfile.asReadonly();

  setProfile(profile: UserProfile, token: string) {
    localStorage.setItem(USER_PROFILE_STORAGE_KEY, JSON.stringify(profile));
    localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
    this.userProfile.set(profile);
  }

  clearProfile() {
    localStorage.removeItem(USER_PROFILE_STORAGE_KEY);
    localStorage.removeItem(TOKEN_KEY);
    this.userProfile.set(null);
  }

  readStoredProfile(): UserProfile | null {
    const stored = localStorage.getItem(USER_PROFILE_STORAGE_KEY);

    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as UserProfile;
    } catch {
      localStorage.removeItem(USER_PROFILE_STORAGE_KEY);
      return null;
    }
  }
}
