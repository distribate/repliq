// import { X } from "lucide-react";
// import { Avatar } from "#components/user/avatar/components/avatar.tsx";
// import { Typography } from "@repo/ui/src/components/typography.tsx";
// import { ThreadHistoryType, updateHistoryThreadsAction } from "../models/history-threads.model.ts";
// import { reatomComponent } from "@reatom/npm-react";
// import { CustomLink } from "#components/shared/link.tsx";
// import { createIdLink } from "@repo/lib/utils/create-link.ts";

// type ThreadHistoryProps = { index?: number } & ThreadHistoryType;

// const ThreadHistoryItem = reatomComponent<Omit<ThreadHistoryProps, "index" | "account">>(({
//   ctx, thread: { id, owner, title }
// }) => {
//   return (
//     <div className="flex gap-1 relative items-center bg-shark-800 rounded-md p-2 w-full">
//       <div
//         onClick={() => updateHistoryThreadsAction(ctx, { type: "delete", data: id })}
//         className="absolute top-2 right-2 cursor-pointer hover:opacity-50"
//       >
//         <X className="w-3 h-3 hover:text-red-500" />
//       </div>
//       <Avatar
//         url={null}
//         nickname={owner}
//         className="min-h-[30px] min-w-[30px] max-w-[30px] max-h-[30px]"
//         propHeight={30}
//         propWidth={30}
//       />
//       <div className="flex flex-col w-full truncate overflow-hidden">
//         <CustomLink to={createIdLink("thread", id)}>
//           <Typography
//             textSize="small"
//             textColor="shark_white"
//             className="truncate"
//           >
//             {title}
//           </Typography>
//         </CustomLink>
//         <Typography className="text-[12px] leading-3 text-shark-300">
//           {owner}
//         </Typography>
//       </div>
//     </div>
//   );
// }, "ThreadHistoryFull")