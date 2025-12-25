import { db } from '@/config/db';
import { users } from '@/config/db/schema/users';
import { envNode } from '@/config/env';
import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { sign } from 'hono/jwt';

export const login = async (
  email: string,
  password: string
): Promise<string> => {
  const user = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .get();

  if (!user) throw new Error('Invalid credentials');
  const ok = bcrypt.compareSync(password, user.passwordHash);
  if (!ok) throw new Error('Invalid credentials');

  return sign(
    {
      sub: user.id,
      exp: Math.floor(Date.now() / 1000) + 60 * 10,
    },
    envNode.JWT_SECRET
  );
};
