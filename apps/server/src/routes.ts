import type { FastifyPluginAsync } from "fastify";
import { healthHandler } from "./handlers/health.js";
import { listUsersHandler } from "./handlers/users.js";
import { insertPasteSchema } from "@repo/db-schema";
import { savePaste, getPaste } from "./handlers/paste.js";

const routes: FastifyPluginAsync = async (app) => {
  app.get("/api/health", healthHandler);
  app.get("/api/users", listUsersHandler);
  app.get("/api/paste/:uuid", getPaste);
  app.post("/api/paste", {
    schema: {
      body: insertPasteSchema
    }
  }, savePaste)
};

export default routes;
