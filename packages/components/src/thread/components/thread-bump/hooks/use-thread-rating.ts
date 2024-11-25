import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateThreadRating, updateThreadRating } from '../../../queries/post-thread-rating.ts';
import { toast } from 'sonner';
import { THREAD_RATING_QUERY_KEY } from '../queries/thread-rating-query.ts';

export const useThreadRating = () => {
  const qc = useQueryClient();
  
  const updateThreadRatingMutation = useMutation({
    mutationFn: async(values: UpdateThreadRating) => {
      if (!values) return;
      
      return updateThreadRating({
        threadId: values.threadId, type: values.type,
      });
    },
    onSuccess: async(data, variables) => {
      if (!data || !variables) return;
      
      if (data === 'alreadyRating') return toast.error("Вы уже оценивали тред");
      if (data === 'default') return toast.error("Что-то пошло не так!");
      
      await qc.invalidateQueries({ queryKey: THREAD_RATING_QUERY_KEY(variables.threadId) });
    },
    onError: e => { throw new Error(e.message); },
  });
  
  return { updateThreadRatingMutation };
};