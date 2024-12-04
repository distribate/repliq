// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import {
//   USER_ACTIVE_SESSIONS_QUERY_KEY,
// } from '#cards/components/user-personal-card/components/account-settings/queries/user-sessions-query.ts';
// import { redirect } from 'next/navigation';
// import { AUTH_REDIRECT } from '@repo/shared/constants/routes.ts';
//
// type TerminateSessionMutation =
//   | {
//   type: 'all';
//   session_uuid?: never;
// }
//   | {
//   type: 'single';
//   session_uuid: Pick<TerminateSession, 'uuid'>['uuid'];
// };
//
// export const TERMINATE_SESSIONS_MUTATION_KEY = [ 'terminate-all-sessions' ];
//
// export const useTerminateSession = () => {
//   const qc = useQueryClient();
//
//   const terminateMutation = useMutation({
//     mutationKey: TERMINATE_SESSIONS_MUTATION_KEY,
//     mutationFn: async({ session_uuid, type }: TerminateSessionMutation) => {
//       if (type === 'single' && session_uuid) {
//         return terminateSession({ uuid: session_uuid });
//       }
//
//       // return terminateAllSessions();
//     },
//     onSuccess: async(data, variables) => {
//       if (!data) return;
//
//       await qc.invalidateQueries({
//         queryKey: USER_ACTIVE_SESSIONS_QUERY_KEY,
//       });
//
//       if (variables.type === 'all') {
//         qc.clear()
//         return redirect(AUTH_REDIRECT);
//       }
//     },
//     onError: e => { throw new Error(e.message); },
//   });
//
//   return { terminateMutation };
// };
