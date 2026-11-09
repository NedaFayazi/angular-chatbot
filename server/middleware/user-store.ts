/// <reference types="node" />
import {randomUUID} from 'node:crypto';

import {hashPassword} from '../auth/password-hasher';
import {User} from '../model/user';
import {INITIAL_MOCK_USER_EMAIL, INITIAL_MOCK_USER_PASSWORD} from '../db-data';

export const users: User[] = [];

let mockUsersInitialized = false;

export async function initializeMockUsers() {
  if (mockUsersInitialized) {
    return;
  }

  users.push({
    id: 'user-1',
    email: INITIAL_MOCK_USER_EMAIL,
    passwordHash: await hashPassword(INITIAL_MOCK_USER_PASSWORD),
  });

  mockUsersInitialized = true;
}

export function findUserByEmail(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  return users.find((user) => user.email.toLowerCase() === normalizedEmail);
}
export async function addUser(email: string, plainTextPassword: string) {
  const user: User = {
    id: randomUUID(),
    email: email.trim().toLowerCase(),
    passwordHash: await hashPassword(plainTextPassword),
  };

  users.push(user);

  return user;
}

export function addUserWithoutPassword(email: string) {
  const user: User = {
    id: randomUUID(),
    email: email.trim().toLowerCase(),
  };

  users.push(user);

  return user;
}
