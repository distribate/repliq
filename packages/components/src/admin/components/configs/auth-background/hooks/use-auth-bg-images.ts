import { useMutation } from '@tanstack/react-query';
import { createAuthImage } from '../queries/create-auth-image.ts';
import { toast } from '@repo/ui/src/hooks/use-toast.ts';
import { encode } from 'base64-arraybuffer';
import { deleteAuthImage } from '../queries/delete-auth-image.ts';
import { useRouter } from 'next/navigation';

function getArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onloadend = () => {
      const result = reader.result as ArrayBuffer;
      resolve(result);
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsArrayBuffer(file);
  });
}

function getFileSizeInMB(file: File): number {
  const sizeInBytes = file.size;
  return sizeInBytes / (1024 * 1024);
}

export const useAuthBackgroundImage = () => {
  const { refresh } = useRouter()
  
  const deleteAuthImageFileMutation = useMutation({
    mutationFn: async (imageName: string) => {
      return await deleteAuthImage(imageName)
    },
    onSuccess: async (data, variables) => {
      if (!data) return toast({
        title: "Произошла ошибка при удалении изображения",
        variant: "negative"
      })
      
      toast({
        title: "Изображение удалено",
        variant: "positive"
      })
      
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
      if (!data) return toast({
        title: 'Произошла ошибка при загрузке изображения',
        variant: 'negative',
      });
      
      if (!Array.isArray(data)) {
        if (data.error === 'no-data') return toast({
          title: 'Что-то пошло не так при загрузке изображений. Попробуйте позже',
          variant: 'negative',
        });
        
        if (data.error === 'limit') return toast({
          title: 'Изображений может быть только 50!',
          variant: 'negative',
        });
      }
      
      toast({
        title: 'Изображение загружено',
        variant: 'positive',
      });
      
      return refresh()
    },
    onError: (e) => {
      throw new Error(e.message);
    },
  });
  
  return { addAuthImageFileMutation, deleteAuthImageFileMutation };
};