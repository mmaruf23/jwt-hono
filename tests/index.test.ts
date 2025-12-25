import app from '@/app';
import type { EnvSchema } from '@/config/env';
import { describe, expect, it } from 'vitest';

describe('Test', () => {
  it('just should run', async () => {
    const res = await app.request('/', { method: 'GET' });
    expect(res.status).toBe(200);
    expect(await res.text()).toBe('Hello Hono!');
  });

  it('get env', async () => {
    const res = await app.request('/env', { method: 'GET' });
    expect(res.ok).toBeTruthy();
    console.log('RESPONSE : ', await res.json());
  });
});
