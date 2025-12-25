import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  JWT_SECRET: z.string().min(1),
});

export const envNode = envSchema.parse(process.env);
export type EnvSchema = z.infer<typeof envSchema>;
