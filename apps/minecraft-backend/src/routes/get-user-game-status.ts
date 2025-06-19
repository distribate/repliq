// import { throwError } from '@repo/lib/helpers/throw-error.ts';
// import { getUserLastVisitTime } from "#lib/queries/user/get-user-last-visit-time.ts";
// import { getNatsConnection } from "@repo/config-nats/nats-client";
// import { Hono } from "hono";
// import { SERVER_EVENT_CHECK_PLAYER_STATUS, SERVER_USER_EVENT_SUBJECT } from '@repo/shared/constants/nats-subjects';

// type PlayerStatus = {
//   nickname: string;
//   type: "online" | "offline"
// }

// async function getPlayerStatus(nickname: string) {
//   const nc = getNatsConnection();

//   const lastVisitTime = await getUserLastVisitTime(nickname);

//   const payload = {
//     event: SERVER_EVENT_CHECK_PLAYER_STATUS, 
//     nickname
//   }

//   const res = await nc.request(SERVER_USER_EVENT_SUBJECT, JSON.stringify(payload), { timeout: 7000 })

//   if (res) {
//     const status = res.json<PlayerStatus>();

//     if (!lastVisitTime) {
//       return { ...status, issued_date: null }
//     }

//     let statusType: "joined" | "quited" = "quited";

//     if (status.type) {
//       statusType = status.type === "online" ? "joined" : "quited";
//     }

//     return { ...status, issued_date: lastVisitTime[statusType] }
//   } else {
//     return { nickname, type: "offline", issued_date: lastVisitTime?.quited }
//   }
// }

// export const getUserGameStatusRoute = new Hono()
//   .get("/get-user-game-status/:nickname", async (ctx) => {
//     const { nickname } = ctx.req.param();

//     try {
//       const payload = await getPlayerStatus(nickname);

//       return ctx.json({ data: payload }, 200);
//     } catch (e) {
//       return ctx.json({ error: throwError(e) }, 500);
//     }
//   })