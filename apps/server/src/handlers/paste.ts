import { and, or, gt, eq } from "drizzle-orm";
import type { FastifyReply, FastifyRequest } from "fastify";
import { pastesTable, InsertPaste,  } from "@repo/db-schema"
import { dbManager } from "../db/client.js";
import { GetPasteParams } from "../types/index.js";
import { log } from "../util/log.js";

export const savePaste = async (req: FastifyRequest<{ Body: InsertPaste}>, reply: FastifyReply) => {
  try {
    const { duration, ...validatedData } = req.body;

    const result = await dbManager.db
      .insert(pastesTable as any)
      .values({
        ...validatedData,
        burnAfterReading: duration === 0,
        expiresAt: new Date(Date.now() + duration * 1000)
      })
      .returning()
      
    const newPaste = Array.isArray(result) ? result[0] : result;
    if (!newPaste) {
      return reply.status(500).send({ error: "Failed to save" });
    }

    return reply.status(201).send(newPaste);
  } catch (err) {
    log.error("Error saving paste", err);
    return reply.status(500).send({ error: "Database save failed" });
  }
}

export const getPaste = async(
  req: FastifyRequest<{ Params: GetPasteParams }>,
  reply: FastifyReply
) => {
  const { uuid } = req.params
  const now = new Date()

  try {
    const paste = await dbManager.db
      .select({
        uuid: pastesTable.uuid,
        hasPassword: pastesTable.hasPassword,
        content: pastesTable.content,
        language: pastesTable.language,
        views: pastesTable.views,
        burnAfterReading: pastesTable.burnAfterReading,
        createdAt: pastesTable.createdAt,
        expiresAt: pastesTable.expiresAt,
      })
      .from(pastesTable)
      .where(
        and(
          eq(pastesTable.uuid, uuid),
          or(
            gt(pastesTable.expiresAt, now),
            eq(pastesTable.burnAfterReading, true)
          )
        )
      )
      .get();

    console.log(paste)

    if (!paste) {
      return reply.status(404).send({ error: "Paste not found" })
    }

    if (paste.burnAfterReading) {
      await dbManager.db
        .delete(pastesTable)
        .where(eq(pastesTable.uuid, uuid))
    }

    return reply.send(paste)
  } catch (err) {
    log.error("Error fetching paste", err)
    return reply.status(500).send({ error: "A server error occurred" })
  }
}