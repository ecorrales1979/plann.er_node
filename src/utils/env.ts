import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  SERVER_URL: z.string().url(),
  FRONT_URL: z.string().url(),
  PORT: z.coerce.number().default(3333),
});

export const env = envSchema.parse(process.env);
