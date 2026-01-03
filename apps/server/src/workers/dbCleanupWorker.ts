import { dbManager } from "../db/client.js";
import { log } from "../util/log.js";

const INTERVAL_MS = 60_000; // 1 minute

let timer: NodeJS.Timeout | null = null;

export const startDBCleanupWorker = () => {
  if (timer) return;

  const run = async () => {
    try {
      const now = Date.now();

      // EXAMPLE — adapt to your schema
      // await db
      //   .delete(pastes)
      //   .where(lte(pastes.expiresAt, now));

      log.info("Ran expired pastes cleanup");
    } catch (err) {
      log.error("Cleanup worker failed", err);
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
