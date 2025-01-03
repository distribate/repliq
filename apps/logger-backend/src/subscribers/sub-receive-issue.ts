import { getNatsConnection } from '@repo/config-nats/nats-client.ts';
import { Issues } from '@repo/types/db/forum-database-types';
import { Selectable } from "kysely"
import { notifyIssueReceived } from '../utils/notify-issue-received';

const subj = "forum.issue.*"

export async function subReceiveIssue() {
  const nc = getNatsConnection()

  return nc.subscribe(subj, {
    callback: async (err, msg) => {
      if (err) {
        console.error(err);
        return;
      }

      const issue: Selectable<Issues> = msg.json()

      if (issue) {
        try {
          await notifyIssueReceived(issue)
        } catch (error) {
          console.error("Error sending issue logs: ", error);
        }
      }
    }
  })
}