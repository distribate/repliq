import { useMutation, useQueryClient } from '@tanstack/react-query';
import { THREAD_FORM_QUERY, ThreadFormQuery } from '../queries/thread-form-query.ts';
import { postThread } from '../queries/post-thread.ts';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { THREAD_URL } from '@repo/shared/constants/routes.ts';
import { getArrayBuffer } from '@repo/lib/helpers/ger-array-buffer.ts';
import { encode } from 'base64-arraybuffer';
import { blobUrlToFile } from '@repo/lib/helpers/blobUrlToFile.ts';
import { getUser } from '@repo/lib/helpers/get-user.ts';

export const useCreateThread = () => {
  const qc = useQueryClient();
  const { push } = useRouter();
  
  const updateThreadFormMutation = useMutation({
    mutationFn: async(values: ThreadFormQuery) => {
      return qc.setQueryData(THREAD_FORM_QUERY,
        (prev: ThreadFormQuery) => ({ ...prev, ...values, }
      ));
    },
    onError: e => { throw new Error(e.message); },
  });
  
  const createPostThreadMutation = useMutation({
    mutationFn: async() => {
      const form = qc.getQueryData<ThreadFormQuery>(THREAD_FORM_QUERY);
      const values = form?.values;
      
      if (!form || !values) return toast.error('Форма должна быть заполнена');
      
      const {
        title, description, visibility, permission, auto_remove,
        isComments, tags, category_id, content, images,
      } = values;
      
      if (!title || !content || !category_id || !visibility) return;
      
      let threadConvertedToBase64Images: Array<string> | null = null;
      let threadRawImages: Array<File> | null = null;
      
      if (images) {
        threadRawImages = [];
        
        for (let i = 0; i < images.length; i++) {
          const rawImageItem = await blobUrlToFile(images[i]);
          threadRawImages.push(rawImageItem);
        }
        
        if (threadRawImages) {
          threadConvertedToBase64Images = [];
          
          for (let i = 0; i < threadRawImages.length; i++) {
            const imageItem = await getArrayBuffer(threadRawImages[i]);
            const encodedImageItem = encode(imageItem);
            
            threadConvertedToBase64Images.push(encodedImageItem);
          }
        } else {
          threadConvertedToBase64Images = null;
        }
      }
      
      return postThread({
        category_id, title, visibility,
        isImages: !!threadConvertedToBase64Images,
        tags: tags ? tags : null,
        content: JSON.stringify(content),
        description: description ?? null,
        permission: permission ?? false,
        auto_remove: auto_remove ?? false,
        isComments: isComments ?? true,
        base64Files: threadConvertedToBase64Images,
      });
    },
    onSuccess: async(data) => {
      if (!data) return toast.error('Произошла ошибка при создании треда');
      
      toast.success('Тред создан');
      
      const formValues = qc.getQueryData<ThreadFormQuery>(THREAD_FORM_QUERY);
      
      if (formValues && formValues.values && formValues.values.images) {
        for (let i = 0; i < formValues.values.images.length; i++) {
          URL.revokeObjectURL(formValues.values.images[i]);
        }
      }
      
      qc.resetQueries({ queryKey: THREAD_FORM_QUERY });
      
      return push(THREAD_URL + data);
    },
    onError: (e) => { throw new Error(e.message); },
  });
  
  return { updateThreadFormMutation, createPostThreadMutation };
};