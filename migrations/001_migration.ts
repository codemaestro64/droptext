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
    .addColumn("views", "integer", (col) => 
      col.notNull().defaultTo(0)
    )
    .addColumn("duration", "integer", (col) => col.notNull())
    .addColumn("createdAt", "datetime", (col) =>
      col.notNull().defaultTo(sql`CURRENT_TIMESTAMP`)
    )
    .execute();
}

export async function down(db: Kysely<Database>): Promise<void> {
  await db.schema.dropTable(pasteTablename).execute()
}