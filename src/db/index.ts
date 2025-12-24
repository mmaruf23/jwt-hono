import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

const client = createClient({
  url: 'file:./drizzle/database.db',
});

export const db = drizzle(client);
