import "dotenv/config";
import { buildServer } from "./server.js";
import { initDb } from "./db/client.js";
import { log } from "./util/log.js";
import { env, DEFAULT_PORT } from "./env.js";
import routes from "./routes.js";
import {
  startDBCleanupWorker,
  stopDBCleanupWorker
} from "./workers/dbCleanupWorker.js";
import type { FastifyInstance } from "fastify";

const bootstrap = async () => {
  let app: FastifyInstance | null = null;

  const shutdown = async (signal: string) => {
    log.info(`Received ${signal}, shutting down`);

    try {
      stopDBCleanupWorker();

      if (app) {
        await app.close();
        log.info("Fastify server closed");
      }

      process.exit(0);
    } catch (err) {
      log.error("Error during shutdown", err);
      process.exit(1);
    }
  };

  try {
    log.info("Initializing database");
    initDb();

    log.info("Building server");
    app = buildServer();

    log.info("Registering routes");
    await app.register(routes);

    log.info("Starting DB cleanup worker");
    startDBCleanupWorker();

    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    const port = env.PORT ?? DEFAULT_PORT;

    log.info(`Listening on port ${port}`);
    await app.listen({ port, host: "0.0.0.0" });
  } catch (err) {
    log.error("Startup failed", err);
    process.exit(1);
  }
};

bootstrap();
