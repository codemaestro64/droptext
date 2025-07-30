import { config } from 'dotenv'
import { Kysely, SqliteDialect } from 'kysely'
import SQLite from 'better-sqlite3'
import { Database } from '@/types/database'

config()

const mode = process.env.DATABASE_MODE
const filePath = process.env.DATABASE_PATH

if (!mode || (mode !== 'file' && mode !== 'memory')) {
  throw new Error(`Invalid DATABASE_MODE: must be 'file' or 'memory'`)
}

let dbInstance: Kysely<Database> | null = null
let sqliteInstance: SQLite.Database | null = null

export function getDbConn(): Kysely<Database> {
  if (!dbInstance) {
    sqliteInstance = new SQLite(mode === 'memory' ? ':memory:' : filePath)
    dbInstance = new Kysely<Database>({
      dialect: new SqliteDialect({ database: sqliteInstance }),
    })
  }
  return dbInstance
}


// gracefull shutdown handler for long running node process
/**export async function closeDbConn() {
  await dbInstance?.destroy()
  sqliteInstance?.close()
}

process.on('SIGINT', async () => {
  console.log('Gracefully shutting down...')
  await closeDbConn()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('Gracefully shutting down...')
  await closeDbConn()
  process.exit(0)
})**/
