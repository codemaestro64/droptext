import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import { createClient, type Client } from "@libsql/client";
import { pushSQLiteSchema } from "drizzle-kit/api";
import * as schema from "@repo/db-schema";
import { log } from "../util/log.js";

export class Database {
  private static instance: Database;
  private _db: LibSQLDatabase<typeof schema> | null = null;
  private _client: Client | null = null;
  private isInitializing = false;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
    }
    return Database.instance;
  }

  public async initialize(): Promise<void> {
    if (this._db) return;
    if (this.isInitializing) return;

    this.isInitializing = true;
    const url = process.env.DB_FILE_NAME;

    if (!url) {
      this.isInitializing = false;
      throw new Error("PRODUCTION_ERROR: DB_FILE_NAME environment variable is missing.");
    }

    try {
      this._client = createClient({ url });
      this._db = drizzle(this._client, { schema });
      
      log.info("Database connection initialized successfully.");
    } catch (err) {
      this._client = null;
      this._db = null;
      log.error("Failed to initialize database connection", err);
      throw err;
    } finally {
      this.isInitializing = false;
    }
  }

  public async applySchema(): Promise<void> {
    try {
      log.info("Schema synchronization started...");

      const { apply } = await pushSQLiteSchema(schema, this.db);
      await apply();
      
      log.info("Database schema synchronized successfully.");
    } catch (error) {
      log.error("Critical error during schema synchronization:", error);
      throw error;
    }
  }

  public get db(): LibSQLDatabase<typeof schema> {
    if (!this._db) {
      throw new Error("Database accessed before initialization. Call initialize() first.");
    }
    return this._db;
  }

  public getClient(): Client {
    if (!this._client) {
      throw new Error("LibSQL client accessed before initialization.");
    }
    return this._client;
  }

  public async close(): Promise<void> {
    if (this._client) {
      this._client.close();
      this._client = null;
      this._db = null;
      log.info("Database connection closed.");
    }
  }
}

export const dbManager = Database.getInstance();