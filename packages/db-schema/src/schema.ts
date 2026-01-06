import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { LANGUAGE_VALUES, type LanguageValue } from "@repo/config";

export const pastesTable = sqliteTable("pastes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  uuid: text("uuid")
    .notNull()
    .$defaultFn(() => crypto.randomUUID()),
  language: text("language", { enum: LANGUAGE_VALUES })
    .notNull()
    .default("text")
    .$type<LanguageValue>(),
  content: text("content").notNull(),
  hasPassword: integer("has_password", { mode: "boolean" })
    .notNull()
    .default(false),
  burnAfterReading: integer("burn_after_reading", { mode: "boolean" })
    .notNull()
    .default(true),
  views: integer("views").default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .$defaultFn(() => new Date()),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" })
});