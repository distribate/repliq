import { cleanupOldEntries } from "#lib/modules/user-activity-status.ts";
import { getBaker } from "./init";

type CronJob = {
  fn: () => Promise<void>;
  cron: string;
};

const CRON_JOBS: Record<string, CronJob> = {
  "cleanup-old-activity-entries": {
    fn: cleanupOldEntries,
    cron: "0 */5 * * * *",
  },
};

export async function startJobs() {
  const baker = getBaker();

  for (const [name, job] of Object.entries(CRON_JOBS)) {
    baker.add({
      name,
      cron: job.cron,
      callback: async () => {
        try {
          await job.fn();
        } catch (err) {
          console.error(`\x1B[35m[Baker]\x1B[0m [${name}] Ошибка выполнения задачи:`, err);
        }
      },
      onError(error) {
        console.error(`\x1B[35m[Baker]\x1B[0m [${name}] Error:`, error);
      },
    });

    console.log(`\x1B[35m[Baker]\x1B[0m ${name} is added to jobs`);
  }

  baker.bakeAll();

  console.log(`[Baker] Started ${Object.keys(CRON_JOBS).length} jobs`);
}