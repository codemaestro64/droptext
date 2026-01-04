import type { FastifyPluginAsync } from "fastify";
import { healthHandler } from "./handlers/health.js";
import { listUsersHandler } from "./handlers/users.js";
import { insertPasteSchema } from "@repo/db-schema";
import { savePaste, getPaste } from "./handlers/paste.js";

const routes: FastifyPluginAsync = async (app) => {
  app.get("/health", healthHandler);
  app.get("/users", listUsersHandler);
  app.get("/paste/:uuid", getPaste);
  app.post("/paste", {
    schema: {
      body: insertPasteSchema
    }
  }, savePaste)
};

export default routes;
