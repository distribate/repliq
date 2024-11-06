import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  deleteCoverImageFromBucket,
  uploadCoverImageInBucket,
} from '@repo/lib/utils/storage/upload-image-to-bucket.ts';
import { updateValueOfUploadedImage } from '@repo/lib/utils/storage/update-value-uploaded-image.ts';
import { nanoid } from 'nanoid';
import { CURRENT_USER_QUERY_KEY } from '@repo/lib/queries/current-user-query.ts';
import { USER_IMAGES_BUCKET } from '@repo/shared/constants/buckets.ts';
import { createTask, registerTaskQueue } from '@repo/lib/helpers/create-task-delay.ts';
import { getArrayBuffer } from '@repo/lib/helpers/ger-array-buffer.ts';
import { encode } from 'base64-arraybuffer';
import { getUser } from '@repo/lib/helpers/get-user.ts';
import { REQUESTED_USER_QUERY_KEY } from '#profile/components/cover/queries/requested-user-query.ts';
import { IMAGE_COVER_QUERY_KEY } from '#profile/components/cover/queries/image-cover-query.ts';

type BackgroundImage = {
  file: File | null,
  customFilename: string | null
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
  const currentUser = getUser();
  
  const revalidateUserQueries = async() => {
    if (!currentUser) return;
    
    await Promise.all([
      qc.invalidateQueries({ queryKey: REQUESTED_USER_QUERY_KEY(currentUser.nickname) }),
      qc.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY }),
    ]);
    
    const tasks = [
      createTask(async() => {
        await qc.invalidateQueries({ queryKey: IMAGE_COVER_QUERY_KEY(currentUser.nickname) });
      }, 400),
    ];
    
    registerTaskQueue(tasks);
  };
  
  const deleteBackgroundImageMutation = useMutation({
    mutationKey: USER_COVER_DELETE_IMAGE_MUTATION_KEY,
    mutationFn: async() => {
      if (!currentUser) return;
      
      const currentCoverImage = currentUser.cover_image;
      
      return deleteCoverImageFromBucket({
        currentCoverImage,
      });
    },
    onSuccess: async(data) => {
      if (!currentUser) return;
      
      if (!data) return toast.error('Произошла ошибка при удалении фона.', {
        description: 'Попробуйте попытку позже!',
      });
      
      toast.success('Фон удалён.');
      
      await updateValueOfUploadedImage({
        table: 'users',
        field: {
          'cover_image': null,
        },
        equals: {
          column: 'id', value: currentUser.id,
        },
      });
      
      return revalidateUserQueries();
    },
    onError: e => { throw new Error(e.message); },
  });
  
  const uploadBackgroundImageMutation = useMutation({
    mutationKey: USER_COVER_UPDATE_IMAGE_MUTATION_KEY,
    onMutate: async(variables) => {
      if (!variables.file && !variables.customFilename) { // if custom image from user
        return toast.error('Выберите изображение');
      }
    },
    mutationFn: async({
      file, customFilename
    }: BackgroundImage) => {
      if (!currentUser) return;
      
      // if upload to existing image from storage (static)
      if (customFilename && !file) {
        return await updateValueOfUploadedImage({
          table: 'users',
          field: {
            'cover_image': customFilename,
          },
          equals: {
            column: 'id', value: currentUser.id,
          },
        });
      }
      
      if (file && !customFilename) {
        const uniqueId = nanoid(3);
        const fileName = `${currentUser.id}${uniqueId}`;
        const arrayBufferedFile = await getArrayBuffer(file);
        const encodedFile = encode(arrayBufferedFile);
        
        const deletedPrev = await deleteCoverImageFromBucket({
          currentCoverImage: currentUser.cover_image,
        });
        
        if (!deletedPrev) {
          toast.error('Произошла ошибка при обновлении фона.', {
            description: 'Попробуйте попытку позже!',
          });
          return;
        }
        
        return uploadCoverImageInBucket({
          bucket: USER_IMAGES_BUCKET,
          folderName: 'cover',
          file: encodedFile, fileName,
        });
      }
    },
    onSuccess: async(data) => {
      if (!currentUser) return;
      
      if (!data) {
        toast.error('Произошла ошибка при обновлении фона.', {
          description: 'Попробуйте попытку позже!',
        });
        
        return;
      }
      
      if (typeof data === 'boolean') {
        toast.success('Фон шапки профиля обновлен!');
        return revalidateUserQueries();
      }
      
      if (typeof data === 'object') {
        if (data.error) {
          toast.error('Произошла ошибка при обновлении фона.', {
            description: data.error.message,
          });
          
          return;
        }
        
        if (data.path) {
          const success = await updateValueOfUploadedImage({
            table: 'users',
            field: { 'cover_image': data.path },
            equals: { column: 'id', value: currentUser.id },
          });
          
          if (!success) {
            toast.error('Произошла ошибка при обновлении фона.', {
              description: 'Попробуйте попытку позже!',
            });
            
            return;
          }
          
          toast.success('Фон шапки профиля обновлен!');
          await revalidateUserQueries();
          return { success, path: data.path };
        }
      }
    },
    onError: e => { throw new Error(e.message); },
  });
  
  return { uploadBackgroundImageMutation, deleteBackgroundImageMutation };
};