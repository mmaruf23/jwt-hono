import app from '@/app';
import type { EnvSchema } from '@/config/env';
import { equal, ok } from 'node:assert';
import { describe, it } from 'node:test';

describe('Test', () => {
  it('just should run', async () => {
    const res = await app.request('/', { method: 'GET' });
    equal(res.status, 200);
    equal(await res.text(), 'Hello Hono!');
  });

  it('get env', async () => {
    const env: EnvSchema = {
      NODE_ENV: 'test',
    };
    const res = await app.request('/env', { method: 'GET' });
    ok(res.ok);
    console.log('RESPONSE : ', await res.json());
  });
});
