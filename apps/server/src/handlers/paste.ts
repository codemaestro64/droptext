import type { FastifyReply, FastifyRequest } from "fastify";
import { pastesTable, InsertPaste,  } from "@repo/db-schema"
import { dbManager } from "../db/client.js";

export const savePaste = async (req: FastifyRequest<{ Body: InsertPaste}>, resp: FastifyReply) => {
  try {
    const { duration, ...validatedData } = req.body;

    const result = await dbManager.db
      .insert(pastesTable as any)
      .values({
        ...validatedData,
        expiresAt: new Date(Date.now() + duration * 1000)
      })
      .returning()
      
    const newPaste = Array.isArray(result) ? result[0] : result;
    if (!newPaste) {
      return resp.status(500).send({ error: "Failed to save" });
    }

    return resp.status(201).send(newPaste);
  } catch (err) {
    req.log.error(err);
    return resp.status(500).send({ error: "Database save failed" });
  }
}