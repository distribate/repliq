import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
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

export const USER_COVER_DELETE_IMAGE_MUTATION_KEY = [ 'user-cover-delete' ];
export const USER_COVER_UPDATE_IMAGE_MUTATION_KEY = [ 'user-cover-update' ];

export const useControlCoverImage = () => {
  const qc = useQueryClient();
  const currentUser = qc.getQueryData<CurrentUser>(CURRENT_USER_QUERY_KEY);
  
  const revalidateUserQueries = async() => {
    if (!currentUser) return;
    
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
  };
  
  const deleteBackgroundImageMutation = useMutation({
    mutationKey: USER_COVER_DELETE_IMAGE_MUTATION_KEY,
    mutationFn: async() => {
      if (!currentUser) return;
      
      const data = await deletePrevImageFromUsers({
        userId: currentUser.id,
      });
      
      if (data) {
        const result = await deleteImageFromBucket({
          bucket: USER_IMAGES_BUCKET, userId: currentUser.id,
        });
        
        if (!result) {
          toast.error('Произошла ошибка при удалении фона.', {
            description: 'Попробуйте попытку позже!',
          });
          
          return result;
        }
        
        toast.success('Фон удалён.');
        
        return result;
      }
      
      toast.error('Произошла ошибка при удалении фона. Попробуй позже!', {
        description: 'Попробуйте попытку позже!',
      });
      
      return false;
    },
    onSuccess: async(data) => data ? revalidateUserQueries() : undefined,
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
        
        if (!success) return toast('Произошла ошибка при обновлении фона', {
          description: 'Попробуйте попытку позже!',
        });
        
        toast.success('Фон шапки профиля обновлен');
        
        return { success };
      }
      
      // if custom image from user
      if (!file) return toast.error('Выберите изображение');
      
      const uniqueId = nanoid(3);
      const fileName = currentUser.id + uniqueId;
      
      if (!fileName) return;
      
      const arrayBufferedFile = await getArrayBuffer(file);
      const encodedFile = encode(arrayBufferedFile);
      
      const deletedPrev = await deleteImageFromBucket({
        bucket: USER_IMAGES_BUCKET, userId: currentUser.id,
      });
      
      if (!deletedPrev) return toast.error('Произошла ошибка при обновлении фона.', {
        description: 'Попробуйте попытку позже!',
      });
      
      const data = await uploadImageToBucket({
        bucket: USER_IMAGES_BUCKET, folderName: 'cover', file: encodedFile, fileName,
      });
      
      if (data.error) return toast.error('Произошла ошибка при обновлении фона.', {
        description: <p>{data.error.message}</p>,
      });
      
      if (data.path) {
        const success = await updateValueOfUploadedImage({
          table: 'users',
          field: {
            'cover_image': data.path,
          },
          equals: {
            column: 'id', value: currentUser.id,
          },
        });
        
        if (!success) return toast.error('Произошла ошибка при обновлении фона.', {
          description: 'Попробуйте попытку позже!',
        });
        
        toast.success('Фон шапки профиля обновлен!');
        
        return { success, path: data.path };
      }
    },
    onSuccess: async(data) => data ? revalidateUserQueries() : undefined,
    onError: (e) => { throw new Error(e.message); },
  });
  
  return { uploadBackgroundImageMutation, deleteBackgroundImageMutation };
};