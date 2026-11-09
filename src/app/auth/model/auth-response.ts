import { UserProfile } from '../../shared/user-profile/user-profile';

export type AuthResponse = {
  user: UserProfile;
  token: string;
};
export type AuthenticatedUser = {
  id: string;
  email: string;
  name: string;
};
