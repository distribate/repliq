import { ImageWrapper } from '#wrappers/image-wrapper.tsx';

type ThreadImageModal = {
  image: string
}

export const ThreadImageModal = ({
  image,
}: ThreadImageModal) => {
  return (
    <ImageWrapper
      propSrc={image}
      propAlt=""
      width={1920}
      className="object-cover"
      height={1080}
      loading="lazy"
    />
  );
};