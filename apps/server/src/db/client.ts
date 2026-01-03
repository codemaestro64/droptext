import path from "node:path";
import fs from "node:fs";
import os from "node:os";
import { drizzle, type LibSQLDatabase } from "drizzle-orm/libsql";
import { createClient, type Client } from "@libsql/client";
import { pushSQLiteSchema } from "drizzle-kit/api";
import * as schema from "@repo/db-schema";
import { log } from "../util/log.js";
import { APP_NAME } from "@repo/config";

export class Database {
  private static instance: Database;
  private _db: LibSQLDatabase<typeof schema> | null = null;
  private _client: Client | null = null;

  private constructor() {}

  public static getInstance(): Database {
    if (!Database.instance) Database.instance = new Database();
    return Database.instance;
  }

  private resolveDbPath(fileName: string): string {
    // If it's already an absolute path or an in-memory DB, return as is
    if (fileName.startsWith("file:") && (fileName.includes("/") || fileName.includes("\\"))) {
      return fileName;
    }

    let baseDir: string;

    // Logic to find the "Appropriate" folder per OS
    switch (process.platform) {
      case "win32":
        baseDir = process.env.LOCALAPPDATA || path.join(os.homedir(), "AppData", "Local");
        break;
      case "darwin":
        baseDir = path.join(os.homedir(), "Library", "Application Support");
        break;
      default: // Linux and others
        baseDir = process.env.XDG_DATA_HOME || path.join(os.homedir(), ".local", "share");
        break;
    }

    const finalDir = path.join(baseDir, APP_NAME.toLocaleLowerCase());
    
    // Ensure the directory exists before the DB tries to write to it
    if (!fs.existsSync(finalDir)) {
      fs.mkdirSync(finalDir, { recursive: true });
    }

    const cleanFileName = fileName.replace("file:", "");
    return `file:${path.join(finalDir, cleanFileName)}`;
  }

  public async initialize(): Promise<void> {
    if (this._db) return;

    let url = process.env.DB_FILE_NAME || "local.db";
    
    // Transform "file:local.db" -> "file:/home/user/.local/share/droptext/local.db"
    url = this.resolveDbPath(url);
    
    log.info(`Connecting to database at: ${url}`);

    try {
      this._client = createClient({ url });
      this._db = drizzle(this._client, { schema });
    } catch (err) {
      log.error("Database initialization failed", err);
      throw err;
    }
  }

  public async applySchema(): Promise<void> {
    try {
      log.info("Checking for schema updates...");
      const { apply } = await pushSQLiteSchema(schema, this.db);
      await apply();
      log.info("Schema synchronized.");
    } catch (error) {
      log.error("Sync failed", error);
      throw error;
    }
  }

  public get db() {
    if (!this._db) throw new Error("Database not initialized");
    return this._db;
  }

  private getClient(): Client {
    if (!this._client) throw new Error("Client not initialized");
    return this._client;
  }
}

export const dbManager = Database.getInstance();