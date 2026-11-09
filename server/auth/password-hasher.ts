import argon2 from 'argon2';

const ARGON2_OPTIONS: argon2.Options = {
  type: argon2.argon2id,
  memoryCost: 19_456,
  timeCost: 2,
  parallelism: 1,
};

export async function hashPassword(plainTextPassword: string) {
  return argon2.hash(plainTextPassword, ARGON2_OPTIONS);
}

export async function verifyPassword(storedHash: string, plainTextPassword: string) {
  try {
    return await argon2.verify(storedHash, plainTextPassword);
  } catch {
    return false;
  }
}

let dummyPasswordHashPromise: Promise<string> | undefined;

export function getDummyPasswordHash() {
  if (!dummyPasswordHashPromise) {
    dummyPasswordHashPromise = hashPassword('unused-placeholder-password');
  }

  return dummyPasswordHashPromise;
}
