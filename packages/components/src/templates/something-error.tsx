import { ImageWrapper } from "../wrappers/image-wrapper.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
// @ts-ignore
import Heart from "@repo/assets/gifs/hardcore-heart-minecraft.gif";

export const SomethingError = () => {
  return (
    <div className="flex w-full items-center justify-center h-full gap-12 px-12 py-6 relative">
      <div className="flex flex-col items-center">
        <ImageWrapper
          propSrc={Heart.src}
          propAlt="Content not found."
          width={96}
          height={96}
        />
        <Typography className="text-xl font-bold text-shark-50">
          Что-то пошло не так. Перезагрузите страницу!
        </Typography>
      </div>
    </div>
  );
};
