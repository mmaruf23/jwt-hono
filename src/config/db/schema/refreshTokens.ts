import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { users } from './users';
import type { InferSelectModel } from 'drizzle-orm';

export const refreshTokens = sqliteTable('refresh_token', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  revokedAt: integer('revoked_at', { mode: 'timestamp' }),
  replacedBy: text('replaced_by'),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .notNull()
    .defaultNow(),
});

export type RefreshToken = InferSelectModel<typeof refreshTokens>;
