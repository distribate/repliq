import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@repo/ui/src/hooks/use-toast.ts';
import {
  deleteImageFromBucket, uploadImageToBucket,
} from '@repo/lib/utils/storage/upload-image-to-bucket.ts';
import { updateValueOfUploadedImage } from '@repo/lib/utils/storage/update-value-uploaded-image.ts';
import { IMAGE_COVER_QUERY_KEY } from '../queries/image-cover-query.ts';
import { nanoid } from 'nanoid';
import { CURRENT_USER_QUERY_KEY, CurrentUser } from '@repo/lib/queries/current-user-query.ts';
import { USER_IMAGES_BUCKET } from '@repo/shared/constants/buckets.ts';
import { createTask, registerTaskQueue } from '@repo/lib/helpers/create-task-delay.ts';
import { deletePrevImageFromUsers } from './delete-prev-image.ts';
import { REQUESTED_USER_QUERY_KEY } from '../../../cover/queries/requested-user-query.ts';
import { getArrayBuffer } from '@repo/lib/helpers/ger-array-buffer.ts';
import { encode } from 'base64-arraybuffer';

type BackgroundImage = {
  file: File | null,
  customFilename?: string
}

export type CoverImageInput = {
  type: 'origin' | 'library',
  file: File | null,
  fileName?: string
}

export const USER_COVER_DELETE_IMAGE_MUTATION_KEY = ["user-cover-delete"]
export const USER_COVER_UPDATE_IMAGE_MUTATION_KEY = ["user-cover-update"]

export const useControlCoverImage = () => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY);
  
  const handleSuccess = async() => {
    if (currentUser) {
      await Promise.all([
        qc.invalidateQueries({ queryKey: REQUESTED_USER_QUERY_KEY(currentUser.nickname) }),
        qc.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY }),
      ]);
      
      const tasks = [
        createTask(async() => {
          await qc.invalidateQueries({ queryKey: IMAGE_COVER_QUERY_KEY(currentUser.nickname) });
        }, 1000),
      ];
      
      registerTaskQueue(tasks);
    }
  };
  
  const deleteBackgroundImageMutation = useMutation({
    mutationKey: USER_COVER_DELETE_IMAGE_MUTATION_KEY,
    mutationFn: async() => {
      if (!currentUser) return null;
      
      const data = await deletePrevImageFromUsers({
        userId: currentUser.id,
      });
      
      if (data) {
        const result = await deleteImageFromBucket({
          bucket: USER_IMAGES_BUCKET, userId: currentUser.id,
        });
        
        if (!result) {
          toast({
            title: 'Произошла ошибка при удалении фона. Попробуй позже!',
            variant: 'negative',
          });
          
          return result;
        }
        
        toast({
          title: 'Фон удалён.',
          variant: 'positive',
        });
        
        return result;
      }
      
      toast({
        title: 'Произошла ошибка при удалении фона. Попробуй позже!',
        variant: 'negative',
      });
      
      return false;
    },
    onSuccess: async(data) => {
      if (data) return handleSuccess();
    },
    onError: (e) => { throw new Error(e.message); },
  });
  
  const uploadBackgroundImageMutation = useMutation({
    mutationKey: USER_COVER_UPDATE_IMAGE_MUTATION_KEY,
    mutationFn: async({
      file, customFilename,
    }: BackgroundImage) => {
      if (!currentUser) return;
      
      // if upload to existing image from storage (static)
      if (customFilename) {
        const success = await updateValueOfUploadedImage({
          table: 'users',
          field: {
            'cover_image': customFilename,
          },
          equals: {
            column: 'id', value: currentUser.id,
          },
        });
        
        if (!success) return toast({
          title: 'Произошла ошибка при обновлении фона. Попробуйте позже!',
          variant: 'negative',
        });
        
        toast({
          title: 'Фон успешно обновлен!',
          variant: 'positive',
        });
        
        return { success };
      }
      
      // if custom image from user
      if (!file) return toast({
        title: 'Выберите файл для фона!',
        variant: 'negative',
      });
      
      const uniqueId = nanoid();
      const fileName = currentUser.id + uniqueId;
      
      if (!fileName) return;
      
      const encodedFile = encode(await getArrayBuffer(file));
      
      const [ deletedPrev, data ] = await Promise.all([
        deleteImageFromBucket({
          bucket: USER_IMAGES_BUCKET, userId: currentUser.id,
        }),
        uploadImageToBucket({
          bucket: USER_IMAGES_BUCKET, folderName: 'cover', file: encodedFile, fileName,
        }),
      ]);
      
      if (!deletedPrev) return toast({
        title: 'Произошла ошибка при обновлении фона. Попробуйте позже!',
        variant: 'negative',
      });
      
      if (data.error) return toast({
        title: 'Произошла ошибка при обновлении фона. Попробуйте позже!',
        variant: 'negative',
        description: <p>{data.error.message}</p>,
      });
      
      if (data.path) {
        const success = await updateValueOfUploadedImage({
          table: 'users',
          field: { 'cover_image': data.path },
          equals: { column: 'id', value: currentUser.id },
        });
        
        if (!success) return toast({
          title: 'Произошла ошибка при обновлении фона. Попробуйте позже!',
          variant: 'negative',
        });
        
        toast({
          title: 'Фон успешно обновлен!',
          variant: 'positive',
        });
        
        return { success, path: data.path };
      }
    },
    onSuccess: async(data) => {
      if (data) return handleSuccess();
    },
    onError: (e) => { throw new Error(e.message); },
  });
  
  return { uploadBackgroundImageMutation, deleteBackgroundImageMutation };
};