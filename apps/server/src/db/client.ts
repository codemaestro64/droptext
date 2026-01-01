import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import { createClient, type Client } from "@libsql/client";

let db: LibSQLDatabase | null = null;
let client: Client | null = null;

export const initDb = (): LibSQLDatabase => {
  if (db) return db;

  const url = process.env.DB_FILE_NAME;

  if (!url) {
    throw new Error("DB_FILE_NAME is not set");
  }

  try {
    client = createClient({ url });
    db = drizzle(client);

    return db;
  } catch (err) {
    throw new Error(
      `Failed to initialize database: ${
        err instanceof Error ? err.message : String(err)
      }`
    );
  }
}

export const getDb = (): LibSQLDatabase => {
  if (!db) {
    throw new Error("Database not initialized. Call initDb() first.");
  }
  return db;
}

