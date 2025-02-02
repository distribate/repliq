import { threadImagesQuery } from "../queries/thread-images-query.ts";
import { Skeleton } from "@repo/ui/src/components/skeleton.tsx";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselApi,
} from "@repo/ui/src/components/carousel.tsx";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@repo/ui/src/components/dialog.tsx";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Plus } from "lucide-react";
import type { EmblaCarouselType } from "embla-carousel";
import { useQueryClient } from "@tanstack/react-query";
import { ThreadDetailed } from "@repo/types/entities/thread-type.ts";
import { THREAD_QUERY_KEY } from "#thread/components/thread-main/queries/thread-query.ts";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import dayjs from "@repo/lib/constants/dayjs-instance.ts";
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'

export const ThreadImagesSkeleton = ({ images_count }: { images_count: number }) => {
  return (
    <div className="grid grid-cols-3 grid-rows-1 gap-2 bg-black/20 px-4 py-2 items-start w-full">
      {[...Array(images_count)].map((_, i) => (
        <Skeleton key={i} className="w-full h-[200px]" />
      ))}
    </div>
  );
};

type ThreadImagesNavigationProps = {
  api: EmblaCarouselType;
};

const ThreadImagesNavigation = ({ api }: ThreadImagesNavigationProps) => {
  return (
    <>
      <div
        onClick={() => api.scrollPrev()}
        className="absolute inline-flex items-center self-center
                justify-center left-0 top-1/2 h-2/3 transform -translate-y-1/2
                hover:from-white/10 duration-150 hover:opacity-100 opacity-0
                bg-gradient-to-r from-transparent to-transparent w-[100px] z-[1]"
      >
        <ArrowLeft size={24} className="text-shark-300/60" />
      </div>
      <div
        onClick={() => api.scrollNext()}
        className="absolute flex items-center
                justify-center right-0 top-1/2 h-2/3 transform -translate-y-1/2
                hover:to-white/10 duration-150 hover:opacity-100 opacity-0
                bg-gradient-to-r from-transparent to-transparent w-[100px] z-[1]"
      >
        <ArrowRight size={24} className="text-shark-300/60" />
      </div>
    </>
  );
};

type ThreadImagesProps = {
  threadId: string
}

export const ThreadImages = ({
  threadId
}: ThreadImagesProps) => {
  const qc = useQueryClient()
  const { data: threadImages, isLoading } = threadImagesQuery(threadId);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [api, setApi] = useState<CarouselApi>();
  const thread = qc.getQueryData<ThreadDetailed>(THREAD_QUERY_KEY(threadId))
  const [hover, setHover] = useState<boolean>(false)

  useEffect(() => {
    if (api && selectedIndex !== null) {
      api.scrollTo(selectedIndex, true);
    }
  }, [api, selectedIndex]);

  if (isLoading) {
    return <ThreadImagesSkeleton images_count={thread?.images_count ?? 2} />
  }

  if (!threadImages || !thread) return null;

  const carouselIsActive = threadImages.length > 1;

  return (
    <Dialog>
      <div className="grid grid-cols-3 max-h-[200px] grid-rows-1 rounded-lg overflow-hidden gap-2 bg-black/20 px-4 py-2 items-start w-full">
        {threadImages.map((image, i) => (
          <DialogTrigger key={i} onClick={() => setSelectedIndex(i)}>
            <img
              src={image}
              alt=""
              width={600}
              className={`object-cover max-h-[calc(200px-16px)] aspect-auto w-full rounded-lg duration-300 hover:brightness-75`}
              height={400}
              loading="lazy"
            />
          </DialogTrigger>
        ))}
      </div>
      <DialogContent className="bg-transparent border-none shadow-none p-0 max-h-[720px] max-w-[1280px]">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            dragFree: false,
            loop: true,
            active: carouselIsActive,
            skipSnaps: true
          }}
          plugins={[WheelGesturesPlugin()]}
        >
          {carouselIsActive && api && <ThreadImagesNavigation api={api} />}
          <CarouselContent className="-mr-4 max-w-6xl">
            {threadImages.map((image, i) => (
              <CarouselItem
                key={i}
                className="max-h-[720px] rounded-lg overflow-hidden h-full !p-0 relative"
                onMouseEnter={() => setHover(true)} 
                onMouseLeave={() => setHover(false)}
              >
                <img
                  src={image}
                  alt=""
                  width={1920}
                  height={1080}
                  className={`object-contain w-full h-[700px]`}
                  loading="lazy"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div
          className={`flex absolute transition-all duration-150 ${hover ? "opacity-100" : "opacity-0"} items-center justify-center w-full bottom-2 z-[1000]`}
        >
          <div className="flex flex-col gap-1 bg-black/60 backdrop-blur-sm rounded-lg py-1 px-4">
            <Typography textSize="large" className="font-semibold">
              {thread.title}
            </Typography>
            {/* <Typography textSize="medium" textColor="gray">
              {dayjs(thread.created_at).format("DD.MM.YYYY HH:mm")}
            </Typography> */}
          </div>
        </div>
      </DialogContent>
    </Dialog >
  );
};