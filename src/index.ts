import { envNode } from '@/config/env';
import { serve } from '@hono/node-server';
import app from '@/app';

if (envNode.NODE_ENV !== 'test') {
  serve(
    {
      fetch: app.fetch,
      port: 3000,
    },
    (info) => {
      console.log(`Server is running on http://localhost:${info.port}`);
    }
  );
}
