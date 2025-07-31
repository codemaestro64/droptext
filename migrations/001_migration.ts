import { Kysely, sql } from 'kysely'
import { Database } from "@/types/database"
import { pasteTablename } from '@/database/pasteRepository'

export async function up(db: Kysely<Database>): Promise<void> {
  await db.schema
    .createTable(pasteTablename)
    .addColumn("id", "integer", (col) => col.primaryKey().autoIncrement())
    .addColumn("uuid", "text", (col) => col.notNull())
    .addColumn("content", "text", (col) => col.notNull())
    .addColumn("language", "text", (col) => col.notNull())
    .addColumn("hasPassword", "boolean", (col) => col.notNull())
    .addColumn("burnAfterReading", "boolean", (col) => col.notNull())
    .addColumn("views", "integer", (col) => 
      col.notNull().defaultTo(0)
    )
    .addColumn('expiresAt', 'integer', (col) => col.notNull())
    .addColumn("createdAt", "integer", (col) => col.notNull())
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable(pasteTablename).execute()
}