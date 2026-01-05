import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { pastesTable } from "./schema.js";

const baseInsertSchema = createInsertSchema(pastesTable, {
  content:  z.string().min(1, "Content cannot be empty"),
  language: z.string()
}).omit({
  id: true,
  uuid: true,
  createdAt: true,
  expiresAt: true,
  views: true,
});

export const insertPasteSchema = baseInsertSchema.extend({
  duration: z.number().min(0, "Duration must be a positive number"),
  hasPassword: z.boolean(),
});

export type InsertPaste = z.infer<typeof insertPasteSchema>;
export const selectPasteSchema: z.ZodObject<any> = createSelectSchema(pastesTable);
