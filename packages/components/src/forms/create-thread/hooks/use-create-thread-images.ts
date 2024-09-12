import { useForm } from 'react-hook-form';
import { zodCreateThreadForm } from '../types/create-thread-form-types.ts';
import { zodResolver } from '@hookform/resolvers/zod';
import { createThreadSchema } from '../schemas/create-thread-schema.ts';
import { threadFormQuery } from '../queries/thread-form-query.ts';

type CreateThreadImageControl = {
  type: "add" | "delete",
  e: React.MouseEvent<SVGSVGElement, MouseEvent>,
  index: number
}

export const useCreateThreadImages = () => {
  const { data: threadFormState } = threadFormQuery();
  
  const {
    control, handleSubmit, resetField, watch,
    formState: { errors, isValid }, setValue
  } = useForm<zodCreateThreadForm>({
    mode: 'onChange',
    resolver: zodResolver(createThreadSchema),
    defaultValues: {
      comments: threadFormState.values?.comments || true,
      description: '', title: '', permission: false,
      auto_remove: false, category: '',
    },
  });
  
  const formImages = watch('images');
  const previewFormImages = Array.from(formImages || [])
  console.log(formImages, '\n\n', previewFormImages)
  
  const handleDeleteImage = (values: Omit<CreateThreadImageControl, "type">) => {
    const { e, index } = values;
    e.preventDefault();
    
    if (!formImages) return;
    if (formImages.length <= 1) {
      resetField('images');
    }
    
    const updatedFormImages = Array.from(formImages).filter((_, i) => i !== index);
    setValue("previewImages", updatedFormImages);
  };
  
  return {
    handleDeleteImage, control, handleSubmit, previewFormImages, errors, isValid, formImages
  }
}