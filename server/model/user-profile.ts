/**
 * The publicly shareable part of a user record: everything except the
 * password hash. This is what gets returned to clients and embedded (by id)
 * in the signed JWT.
 */
export type UserProfile = {
  id: string;
  email: string;
};
