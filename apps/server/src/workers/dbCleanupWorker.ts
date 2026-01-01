import { getDb } from "../db/client.js";

const INTERVAL_MS = 60_000; // 1 minute

let timer: NodeJS.Timeout | null = null;

export const startDBCleanupWorker = () => {
  if (timer) return;

  const run = async () => {
    try {
      const db = getDb();
      const now = Date.now();

      // EXAMPLE — adapt to your schema
      // await db
      //   .delete(pastes)
      //   .where(lte(pastes.expiresAt, now));

      console.log("ran expired pastes cleanup");
    } catch (err) {
      console.error("cleanup worker failed", err);
    }
  };

  // run immediately, then run at intervals
  run();
  timer = setInterval(run, INTERVAL_MS);
}

export const stopDBCleanupWorker = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}
