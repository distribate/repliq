import { useMutation, useQueryClient } from '@tanstack/react-query';
import { terminateAllSessions, TerminateSession, terminateSession } from '@repo/lib/actions/terminate-session.ts';
import {
  USER_ACTIVE_SESSIONS_QUERY_KEY,
} from '#cards/components/user-personal-card/components/account-settings/queries/user-sessions-query.ts';
import { permanentRedirect, RedirectType } from 'next/navigation';
import { getUser } from '@repo/lib/helpers/get-user.ts';

type TerminateSessionMutation = {
  values?: Pick<TerminateSession, 'session_id'>,
  type?: 'single' | 'all'
}

export const TERMINATE_SESSIONS_MUTATION_KEY = ["terminate-all-sessions"]

export const useTerminateSession = () => {
  const qc = useQueryClient();
  const currentUser = getUser();
  
  const terminateMutation = useMutation({
    mutationKey: TERMINATE_SESSIONS_MUTATION_KEY,
      mutationFn: async({ values, type }: TerminateSessionMutation) => {
        if (!currentUser || !type) return;
        
        if (type === 'single' && values && values.session_id) {
          return terminateSession({
            session_id: values.session_id,
          });
        }
        
        return terminateAllSessions({
          user_id: currentUser.id,
        });
      },
      onSuccess: async(data, variables) => {
        if (!variables.type || !variables.values || !data) return;
        
        await qc.invalidateQueries({ queryKey: USER_ACTIVE_SESSIONS_QUERY_KEY });
        
        if (variables.type === 'single' && !Array.isArray(data)) {
          if (data.id === variables.values.session_id) {
            permanentRedirect('/auth', RedirectType.push);
          }
        }
      },
      onError: (e) => { throw new Error(e.message); },
    },
  );
  
  return { terminateMutation };
};