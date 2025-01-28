import { useQuery } from '@tanstack/react-query';
import { createQueryKey } from '@repo/lib/helpers/query-key-builder.ts';
import { forumLandingClient } from '@repo/shared/api/forum-client';

export const DEFAULT_IMAGES_QUERY = createQueryKey('ui', [
  'cover',
  'default-images',
]);

async function getLibraryImages() {
  const res = await forumLandingClient["get-images-library"].$get();

  const data = await res.json()

  if ('error' in data) {
    return null
  }

  return data.data
}

export const defaultImagesQuery = () => useQuery({
  queryKey: DEFAULT_IMAGES_QUERY,
  queryFn: getLibraryImages,
  refetchOnWindowFocus: false,
  refetchOnMount: false
});