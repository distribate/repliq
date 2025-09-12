import { cleanupOldEntries } from "#lib/modules/user-activity-status.ts";
import { updatePublicState } from "#routes/public/get-public-stats.ts";
import { getBaker } from ".";

type CronJob = {
  fn: () => Promise<void>;
  cron: string;
};

const CRON_JOBS: Record<string, CronJob> = {
  "cleanup-old-activity-entries": {
    fn: cleanupOldEntries,
    cron: "0 */5 * * * *",
  },
  "update-public-stats": {
    fn: updatePublicState,
    cron: "0 */30 * * * *"
  }
};

export async function startJobs() {
  const baker = getBaker();

  for (const [name, job] of Object.entries(CRON_JOBS)) {
    baker.add({
      name,
      cron: job.cron,
      immediate: true,
      callback: async () => {
        await job.fn();
      },
      onError(error) {
        console.error(`\x1B[35m[Baker]\x1B[0m [${name}] Job error:`, error);
      },
      onTick: () => {
        console.log(`\x1B[35m[Baker]\x1B[0m [${name}] Job started`);
      },
      onComplete: () => {
        console.log(`\x1B[35m[Baker]\x1B[0m [${name}] Job completed`);
      },
    });

    console.log(`\x1B[35m[Baker]\x1B[0m ${name} is added to jobs`);
  }

  baker.bakeAll();

  console.log(`\x1B[35m[Baker]\x1B[0m Started ${Object.keys(CRON_JOBS).length} jobs`);
}