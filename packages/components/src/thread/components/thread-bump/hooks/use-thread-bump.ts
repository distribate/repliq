import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateThreadRating, updateThreadRating } from '../../../queries/post-thread-rating.ts';
import { toast } from '@repo/ui/src/hooks/use-toast.ts';
import { THREAD_RATING_QUERY_KEY } from '../queries/thread-rating-query.ts';

export const useThreadBump = () => {
  const qc = useQueryClient();
  
  const updateThreadRatingMutation = useMutation({
    mutationFn: async (values: UpdateThreadRating) => {
      if (!values) return;
      
      return updateThreadRating({
        thread_id: values.thread_id, type: values.type
      })
    },
    onSuccess: async (data, variables, context) => {
      if (!data || !variables) return;
      
      if (data === 'alreadyRating') {
        toast({
          title: "Вы уже оценивали тред", variant: "negative"
        })
        
        return;
      }
      
      if (data === 'default') {
        toast({
          title: "Что-то пошло не так!", variant: "negative"
        })
        
        return;
      }
      
      await qc.invalidateQueries({
        queryKey: THREAD_RATING_QUERY_KEY(variables.thread_id)
      })
    },
    onError: (e) => { throw new Error(e.message) }
  })
  
  return { updateThreadRatingMutation };
}