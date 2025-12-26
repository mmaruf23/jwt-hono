import app from '@/app';
import { describe, expect, it } from 'vitest';

describe('Test', () => {
  it('just should run', async () => {
    const res = await app.request('/', { method: 'GET' });
    expect(res.status).toBe(200);
    expect(await res.text()).toBe('Hello Hono!');
  });
});
