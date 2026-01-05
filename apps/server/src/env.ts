import { z } from "zod";
import dotenv from "dotenv";

dotenv.config({
  path:
    process.env.NODE_ENV === "production"
      ? ".env.production"
      : ".env.development"
});

export const DEFAULT_PORT = 3000;

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
  PORT: z.coerce.number().default(DEFAULT_PORT),
  DB_FILE_NAME: z.string().min(1),
  CORS_ORIGINS: z
    .string()
    .optional()
    .transform(v => v?.split(",").map(s => s.trim()))
});

export const env = envSchema.parse(process.env);
