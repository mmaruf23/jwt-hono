import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  dialect: 'sqlite',
  schema: './src/config/db/schema',
  out: './drizzle/migrations',
  dbCredentials: {
    url: './drizzle/database.db',
  },
});
