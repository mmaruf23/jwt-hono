import { randomUUID } from 'node:crypto';
import { db } from './index';
import { users } from './schema/users';
import bcrypt from 'bcryptjs';

const generatePassword = async (s: string) => {
  return await bcrypt.hash(s, 10);
};

async function seed() {
  const passwordHash = await generatePassword('rahasia');
  await db.insert(users).values([
    {
      id: randomUUID(),
      name: 'Rifa Sella',
      email: 'user1@example.com',
      passwordHash,
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
