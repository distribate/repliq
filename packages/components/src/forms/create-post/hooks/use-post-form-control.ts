import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreatePostFieldType, POST_FORM_FIELD_QUERY_KEY } from '../queries/post-form-query.ts';

export const usePostFormControl = () => {
  const qc = useQueryClient();
  
  const postFormFieldsMutation = useMutation({
    mutationFn: async(values: CreatePostFieldType) => {
      return qc.setQueryData(
        POST_FORM_FIELD_QUERY_KEY,
        (prev: CreatePostFieldType) => ({ ...prev, ...values }),
      );
    },
    onSettled: () => qc.invalidateQueries({ queryKey: POST_FORM_FIELD_QUERY_KEY }),
    onError: e => { throw new Error(e.message); },
  });
  
  return { postFormFieldsMutation };
};