import { useMutation, useQueryClient } from '@tanstack/react-query';
import { THREAD_FORM_QUERY, ThreadFormQuery } from '../queries/thread-form-query.ts';
import { postThread } from '../queries/post-thread.ts';
import { toast } from '@repo/ui/src/hooks/use-toast.ts';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { useRouter } from 'next/navigation';
import { createClient } from '@repo/lib/utils/supabase/client.ts';
import { postThreadImages } from '../queries/post-thread-images.ts';
import { THREAD_URL } from '@repo/shared/constants/routes.ts';

const supabase = createClient()

export const useCreateThread = () => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY)
  const { replace } = useRouter()
  
  const updateThreadFormMutation = useMutation({
    mutationFn: async({ formState, values }: ThreadFormQuery) => {
      qc.setQueryData(THREAD_FORM_QUERY, (prev: ThreadFormQuery) =>
        prev ? {
          ...prev,
          values: { ...prev.values, ...values },
          formState: { ...prev.formState, ...formState },
        } : prev,
      );
    },
    onSuccess: async() => await qc.invalidateQueries({ queryKey: THREAD_FORM_QUERY }),
    onError: (e) => { throw new Error(e.message) },
  });
  
  const createPostThreadMutation = useMutation({
    mutationFn: async({ images }: Partial<{ images: File[] | null }>) => {
      if (!currentUser) return;
      
      const form = qc.getQueryData<ThreadFormQuery>(THREAD_FORM_QUERY);
      const values = form?.values;
      const uploadedPaths: string[] = []
      
      if (!form || !values) {
        toast({
          title: 'Форма должна быть заполнена', variant: 'negative',
        });
        
        return;
      }
      
      const { title, description, visibility, permission, auto_remove, comments, tags, category_id, content } = values;
      
      if (!title || !content || !category_id || !visibility) return;
      
      const createdThread = await postThread({
        category_id, title,
        user_nickname: currentUser.nickname,
        tags: tags ? tags : null,
        content: JSON.stringify(content),
        description: description ?? null,
        permission: permission ?? false,
        auto_remove: auto_remove ?? false,
        comments: comments ?? true,
        visibility
      });
      
      if (images && images.length >= 1 && createdThread) {
        for (let i = 0; i < images.length; i++) {
          const image = images[i];
          const fileName = createdThread.thread_id + `-image-` + i;
          
          const { data, error } = await supabase
          .storage
          .from('threads')
          .upload(fileName, image, {
            cacheControl: '3600',
            upsert: false,
          });
          
          if (error) {
            throw new Error(error.message);
          }
          
          uploadedPaths.push(data.path);
        }
        
        await postThreadImages({
          thread_id: createdThread.thread_id, paths: uploadedPaths
        })
      }
      
      if (!createdThread) {
        toast({
          title: "Произошла ошибка при публикации поста.",
          description: "Пожалуйста, перезагрузите страницу, сохранив контент!",
          variant: "negative"
        })
        
        return;
      }
      
      return createdThread.thread_id;
    },
    onSuccess: async(data) => {
      if (data) replace(THREAD_URL + data);
    },
    onError: (e) => {
      toast({
        title: 'Что-то пошло не так!', variant: 'negative',
      });
      
      throw new Error(e.message);
    },
  });
  
  return { updateThreadFormMutation, createPostThreadMutation };
}