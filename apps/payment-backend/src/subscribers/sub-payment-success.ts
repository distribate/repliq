import { paymentsDB } from "#shared/database/payments-db.ts";
import { getNatsConnection } from "@repo/config-nats/nats-client"

export const subscribePaymentUpdateSuccess = () => {
  const nc = getNatsConnection()

  return nc.subscribe("payment.event.status", {
    callback: async (err, msg) => {
      if (err) {
        console.error(err);
        return;
      }

      const message = msg.json<{ type: "success" | "failed", hash: string }>()

      try {
        await paymentsDB
          .updateTable("payments_crypto")
          .set({ status: "received" })
          .where("orderid", "=", message.hash)
          .executeTakeFirstOrThrow()
      } catch (e) {
        console.error(e)
      }
    }
  })
}