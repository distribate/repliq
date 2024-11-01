import { useMutation } from '@tanstack/react-query';
import { createAuthImage } from '../queries/create-auth-image.ts';
import { toast } from 'sonner';
import { encode } from 'base64-arraybuffer';
import { deleteAuthImage } from '../queries/delete-auth-image.ts';
import { useRouter } from 'next/navigation';
import { getArrayBuffer } from '@repo/lib/helpers/ger-array-buffer.ts';
import { getFileSizeInMB } from '@repo/lib/helpers/get-file-size.ts';

export const useAuthBackgroundImage = () => {
  const { refresh } = useRouter()
  
  const deleteAuthImageFileMutation = useMutation({
    mutationFn: async (imageName: string) => {
      return await deleteAuthImage(imageName)
    },
    onSuccess: async (data, variables) => {
      if (!data) return toast.error("Произошла ошибка при удалении изображения")
      
      toast.success("Изображение удалено")
      
      return refresh()
    },
    onError: (e) => {
      throw new Error(e.message)
    }
  })
  
  const addAuthImageFileMutation = useMutation({
    mutationFn: async(files: FileList) => {
      const convertedFiles = Array.from(files).slice(0, 3);
      
      let base64Files: string[] = [];
      
      for (let i = 0; i < convertedFiles.length; i++) {
        const rawFile = convertedFiles[i];
        const fileSize = getFileSizeInMB(rawFile);
       
        if (Number(fileSize.toFixed()) >= 10) {
          return;
        }
        
        const file = await getArrayBuffer(convertedFiles[i]);
        const encodedFile = encode(file);
        
        base64Files.push(encodedFile);
      }
      
      return createAuthImage(base64Files);
    },
    onSuccess: async(data, variables) => {
      if (!data) return toast.error( 'Произошла ошибка при загрузке изображения');
      
      if (!Array.isArray(data)) {
        if (data.error === 'no-data') return toast.error( 'Что-то пошло не так при загрузке изображений.', {
          description: 'Попробуйте попытку позже',
        });
        
        if (data.error === 'limit') return toast.info('Изображений может быть только 50!');
      }
      
      toast.success('Изображение загружено');
      
      return refresh()
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });
  
  return { addAuthImageFileMutation, deleteAuthImageFileMutation };
};