import { UserProfile } from './user-profile';

export type AuthResponse = {
  user: UserProfile;
  token: string;
};
