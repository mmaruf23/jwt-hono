// src/db/seed.ts
import { randomUUID } from 'node:crypto';
import { db } from './index';
import { users } from './schema/users';

async function seed() {
  await db.insert(users).values([
    {
      id: randomUUID(),
      name: 'admin',
      email: 'admin@example.com',
      passwordHash: 'hashed-password',
    },
  ]);

  console.log('🌱 Seed done');
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
