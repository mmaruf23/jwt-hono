import { db } from '@/config/db';
import { users } from '@/config/db/schema/users';
import { eq } from 'drizzle-orm';
import { NewUserNotFoundError } from './user.exception';

export const getProfile = async (id: string) => {
  const user = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
    })
    .from(users)
    .where(eq(users.id, id))
    .get();
  if (!user) throw NewUserNotFoundError(id);

  return user;
};

export const updateProfile = async (id: string, newName: string) => {
  const result = await db
    .update(users)
    .set({
      name: newName,
    })
    .where(eq(users.id, id));

  if (result.rowsAffected === 0) throw NewUserNotFoundError(id);
};
