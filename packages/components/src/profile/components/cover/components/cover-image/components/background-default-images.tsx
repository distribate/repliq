import { ImageWrapper } from '../../../../../../wrappers/image-wrapper.tsx';
import { CoverImageInput, useControlCoverImage } from '../hooks/use-control-cover-image.tsx';
import { defaultImagesQuery } from '../queries/default-images-query.ts';
import { LibraryBackgroundImageItem } from './library-background-image-item.tsx';

export const BackgroundDefaultImages = () => {
  const { uploadBackgroundImageMutation } = useControlCoverImage();
  const { data: defaultImages } = defaultImagesQuery();
  
  if (!defaultImages) return null;
  
  const handleCoverImageInput = ({
    fileName,
  }: Pick<CoverImageInput, 'fileName'>) => {
    if (!fileName) return;
    
    return uploadBackgroundImageMutation.mutate({
      file: null, customFilename: fileName,
    });
  };
  
  return (
    <div className="grid grid-cols-3 gap-2 grid-rows-1 w-full">
      {defaultImages.map((image, i) => (
        <LibraryBackgroundImageItem
          key={i}
          onClick={() => handleCoverImageInput({
            // @ts-ignore
            fileName: image.path, file: null,
          })}
        >
          <ImageWrapper
            // @ts-ignore
            propSrc={image.signedUrl}
            // @ts-ignore
            propAlt={image.path}
            height={900}
            width={1200}
            loading="lazy"
            className="min-w-[340px] group-hover:brightness-50 transition-all duration-150"
          />
        </LibraryBackgroundImageItem>
      ))}
    </div>
  );
};