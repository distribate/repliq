import { ImageWrapper } from '../../../../../../wrappers/image-wrapper.tsx';
import { CoverImageInput, useControlCoverImage } from '../hooks/use-control-cover-image.tsx';
import { HTMLAttributes } from 'react';
import { defaultImagesQuery } from '../queries/default-images-query.ts';

interface LibraryBackgroundItemsProps
  extends HTMLAttributes<HTMLDivElement> {
}

const LibraryBackgroundItem = ({
  children, ...props
}: LibraryBackgroundItemsProps) => {
  return (
    <div className="flex flex-col rounded-lg overflow-hidden border border-shark-800 relative hover:bg-white/10
		 cursor-pointer group transition-all duration-150 w-full" {...props}>
      {children}
    </div>
  );
};

export const BackgroundDefaultImages = () => {
  const { uploadBackgroundImageMutation } = useControlCoverImage();
  const { data: defaultImages } = defaultImagesQuery();
  
  const handleCoverImageInput = ({
    fileName, type,
  }: CoverImageInput) => {
    if (!type) return;
    
    if (type === 'library') {
      if (!fileName) return;
      
      return uploadBackgroundImageMutation.mutate({
        file: null, customFilename: fileName,
      });
    }
  };

  if (!defaultImages) return;
  
  return (
    <div className="grid grid-cols-3 gap-2 grid-rows-1 w-full">
      {defaultImages.map((image, i) => (
        <LibraryBackgroundItem
          key={i}
          onClick={() => handleCoverImageInput({
            // @ts-ignore
            type: 'library', fileName: image.path, file: null,
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
        </LibraryBackgroundItem>
      ))}
    </div>
  );
};