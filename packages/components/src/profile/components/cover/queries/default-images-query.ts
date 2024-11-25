import { useQuery } from '@tanstack/react-query';
import { getListFilesInBucket } from '@repo/lib/utils/storage/get-list-files-in-bucket.ts';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';

export const DEFAULT_IMAGES_QUERY = createQueryKey("ui", ["cover", "default-images"])

export const defaultImagesQuery = () => useQuery({
  queryKey: DEFAULT_IMAGES_QUERY,
  queryFn: () => getListFilesInBucket({
    bucket: "user_images", folderName: "default", signed: true
  }),
  refetchOnWindowFocus: false
})