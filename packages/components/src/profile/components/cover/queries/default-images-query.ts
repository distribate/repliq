import { useQuery } from '@tanstack/react-query';
import { getSignedURLs } from '@repo/lib/utils/storage/get-list-files-in-bucket.ts';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';

export const DEFAULT_IMAGES_QUERY = createQueryKey('ui', [
  'cover',
  'default-images',
]);

type Image = {
  error: string | null;
  path: string;
  signedUrl: string
};

export const defaultImagesQuery = () => useQuery<Image[] | null, Error>({
  queryKey: DEFAULT_IMAGES_QUERY,
  queryFn: async () => {
    const data = await getSignedURLs({ bucket: 'user_images', folderName: 'default' })
    
    if (!data) return null;
    
    return data.filter((image): image is Omit<Image, 'path'> & { path: string } =>
      image.path !== null
    )
  },
  refetchOnWindowFocus: false,
  refetchOnMount: false
});