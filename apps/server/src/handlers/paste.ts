import { eq, sql } from "drizzle-orm"
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

export const getPaste = async (
  req: FastifyRequest<{ Params: GetPasteParams }>,
  reply: FastifyReply
) => {
  const { uuid } = req.params

  try {
    const now = new Date()

    const result = await dbManager.db.transaction(async (tx) => {
      const paste = await tx
        .select({
          uuid: pastesTable.uuid,
          content: pastesTable.content,
          language: pastesTable.language,
          views: pastesTable.views,
          burnAfterReading: pastesTable.burnAfterReading,
          expiresAt: pastesTable.expiresAt,
        })
        .from(pastesTable)
        .where(eq(pastesTable.uuid, uuid))
        .get()

      if (!paste) {
        return { type: "not_found" as const }
      }

      if (paste.expiresAt && paste.expiresAt <= now) {
        await tx
          .delete(pastesTable)
          .where(eq(pastesTable.uuid, uuid))

        return { type: "expired" as const }
      }

      if (paste.burnAfterReading) {
        await tx
          .delete(pastesTable)
          .where(eq(pastesTable.uuid, uuid))

        return {
          type: "burned" as const,
          paste,
        }
      }

      await tx
        .update(pastesTable)
        .set({
          views: sql`${pastesTable.views} + 1`,
        })
        .where(eq(pastesTable.uuid, uuid))

      return {
        type: "ok" as const,
        paste: {
          ...paste,
          views: (paste.views ?? 0) + 1,
        },
      }
    })

    if (result.type === "not_found") {
      return reply.status(404).send({ error: "Paste not found" })
    }

    if (result.type === "expired") {
      return reply.status(410).send({ error: "Paste has expired" })
    }

    if (result.type === "burned") {
      return reply.send(result.paste)
    }

    return reply.send(result.paste)

  } catch (err) {
    log.error("Error fetching paste", err)
    return reply.status(500).send({ error: "A server error occurred" })
  }
}