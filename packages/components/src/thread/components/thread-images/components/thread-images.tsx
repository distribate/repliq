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
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { EmblaCarouselType } from "embla-carousel";

export const ThreadImagesSkeleton = () => {
  return (
    <div className="grid grid-cols-3 grid-rows-1 gap-2 bg-black/20 px-4 py-2 items-start w-full">
      <Skeleton className="w-full h-[200px]" />
      <Skeleton className="w-full h-[200px]" />
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
  const { data: threadImages, isLoading } = threadImagesQuery(threadId);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [api, setApi] = useState<CarouselApi>();

  useEffect(() => {
    if (api && selectedIndex !== null) api.scrollTo(selectedIndex, true);
  }, [api, selectedIndex]);

  if (isLoading) return <ThreadImagesSkeleton />;

  if (!threadImages) return null;

  const carouselIsActive = threadImages.length > 1;

  return (
    <Dialog>
      <div className="grid grid-cols-3 grid-rows-1 gap-2 bg-black/20 px-4 py-2 items-start w-full">
        {threadImages.map((image, i) => (
          <DialogTrigger key={i} onClick={() => setSelectedIndex(i)}>
            <img
              src={image}
              alt=""
              width={600}
              className={`object-cover max-h-[200px] w-fit rounded-md group-hover:brightness-50`}
              height={400}
              loading="lazy"
            />
          </DialogTrigger>
        ))}
      </div>
      <DialogContent className="bg-opacity-60 border-none p-0 max-h-[720px] max-w-[1280px]">
        <Carousel
          setApi={setApi}
          opts={{
            align: "start",
            dragFree: false,
            loop: true,
            active: carouselIsActive,
          }}
        >
          {carouselIsActive && api && <ThreadImagesNavigation api={api} />}
          <CarouselContent className="-mr-4">
            {threadImages.map((image, i) => (
              <CarouselItem key={i} className="max-h-[720px] !p-0 relative">
                <img
                  src={image}
                  alt=""
                  width={1920}
                  height={1080}
                  className={`object-contain rounded-md max-h-[700px]`}
                  loading="lazy"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </DialogContent>
    </Dialog>
  );
};