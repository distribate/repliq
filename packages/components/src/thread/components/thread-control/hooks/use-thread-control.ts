import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ThreadModel } from '../../../queries/get-thread-model.ts';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { THREAD_RATING_QUERY_KEY } from '../../thread-bump/queries/thread-rating-query.ts';
import { updateThreadFields } from '../queries/update-thread-fields.ts';
import { toast } from '@repo/ui/src/hooks/use-toast.ts';
import { useRouter } from 'next/navigation';
import { CURRENT_THREAD_QUERY_KEY } from '../queries/current-thread-query.ts';
import { revalidatePath } from "next/cache"

export type ThreadControlType = 'comments' | 'permission' | 'content' | 'remove' | 'description' | 'title'

export type ThreadControl = Pick<ThreadModel, 'id'> & {
  type: ThreadControlType
}

export type ThreadControlValues = Partial<{
  comments: boolean,
  title: string,
  description: string
}>

export const THREAD_CONTROL_MUTATION_KEY = ["thread-control-update"]

export const useThreadControl = () => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY)
  const { replace, refresh } = useRouter()
  
  const updateThreadFieldsMutation = useMutation({
    mutationKey: THREAD_CONTROL_MUTATION_KEY,
    mutationFn: async(values: ThreadControl & ThreadControlValues) => {
      if (!values || !currentUser) return;

      switch(values.type) {
        case 'comments':
          if (typeof values.comments === 'undefined') return;
          
          return updateThreadFields({
            id: values.id,
            field: { 'comments': values.comments },
            type: 'comments',
          });
        case 'remove':
          return updateThreadFields({
            id: values.id,
            type: 'remove'
          });
        case 'title':
          if (!values.title) return;
          
          return updateThreadFields({
            id: values.id,
            type: 'title',
            field: { 'title': values.title, }
          });
        case 'description':
          if (!values.description) return;
          
          return updateThreadFields({
            id: values.id,
            type: 'description',
            field: { 'description': values.description }
          });
      }
    },
    onSuccess: async(data, variables) => {
      if (!data || !variables) {
        return toast({
          title: 'Произошла ошибка при обновлении', variant: 'negative',
        });
      }
      
      if (variables.type === 'remove') {
        replace("/");
        return revalidatePath("/")
      }
      
      await Promise.all([
        qc.invalidateQueries({ queryKey: CURRENT_THREAD_QUERY_KEY(variables.id) }),
        qc.invalidateQueries({ queryKey: THREAD_RATING_QUERY_KEY(variables.id) })
      ])
      
      return refresh();
    },
    onError: (e) => { throw new Error(e.message); },
  });
  
  return { updateThreadFieldsMutation };
};