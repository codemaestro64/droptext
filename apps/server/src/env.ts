import { z } from "zod";

export const DEFAULT_PORT = 3000

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().default(DEFAULT_PORT),
  DB_FILE_NAME: z.string().min(1)
});

export const env = envSchema.parse(process.env);
