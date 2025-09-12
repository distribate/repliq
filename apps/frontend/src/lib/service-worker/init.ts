import { action } from "@reatom/core";
import { connectServiceWorker } from "./connect";
import { log } from "#shared/utils/log";

export const initServiceWorker = action(async (ctx) => {
  await connectServiceWorker({
    path: '/worker.js',
    autoSkipWaiting: false,
    onUpdate: (reg) => {
      log("SW", "update available", reg.scope);
    },
    onRegistered: (reg) => {
      log("SW", "registered", reg.scope)
    },
    onError: (err) => {
      log("SW", err)
    }
  })
}, "initSW")