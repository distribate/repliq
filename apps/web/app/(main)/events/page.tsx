import { ImageWrapper } from "@repo/components/src/wrappers/image-wrapper.tsx";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import Events from "@repo/assets/gifs/minecraft-boime.gif";

export default async function EventsPage() {
  return (
    <div className="flex w-full items-center justify-center h-full gap-12 px-12 py-6 relative">
      <div className="flex flex-col items-center gap-y-4">
        <ImageWrapper
          propSrc={Events.src}
          propAlt=""
          width={256}
          height={256}
        />
        <Typography className="text-xl font-bold text-shark-50">
          Ивентов пока нет
        </Typography>
      </div>
    </div>
  );
}
