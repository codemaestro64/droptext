import Fastify from "fastify";
import { env } from "./env.js";

export function buildServer() {
  const app = Fastify({
    logger: env.NODE_ENV === "production"
  });

  return app;
}
