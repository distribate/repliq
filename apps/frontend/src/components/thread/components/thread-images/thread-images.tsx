import type { EmblaCarouselType } from "embla-carousel";
import { Carousel, CarouselContent, CarouselItem, } from "@repo/ui/src/components/carousel.tsx";
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "@repo/ui/src/components/dialog.tsx";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { threadAtom, threadImagesAtom } from "#components/thread/models/thread.model";
import { Typography } from "@repo/ui/src/components/typography.tsx";
import { WheelGesturesPlugin } from 'embla-carousel-wheel-gestures'
import { reatomComponent } from "@reatom/npm-react";
import { cva } from "class-variance-authority";
import { action, atom, type Ctx } from "@reatom/core";

const threadImagesNavigation = cva(`
  absolute inline-flex items-center self-center justify-center rounded-lg transform -translate-y-1/2
  hover:via-white/20 duration-150 hover:opacity-100 opacity-0 cursor-pointer
  bg-gradient-to-r from-transparent to-transparent w-[100px] z-[1] text-shark-300
`)

const carouselApiAtom = atom<EmblaCarouselType | null>(null, "carouselApi")
const carouselIsHoveredAtom = atom(false, "carouselIsHoveredAtom");
const carouselSelectedIdxAtom = atom(0, "carouselSelectedIdx")
const carouselIsFirstOpenedAtom = atom(false, "isFirstOpened")

const carouselIsActiveAtom = atom((ctx) => {
  const target = ctx.spy(threadImagesAtom)
  return target ? target.length > 1 : false
}, "carouselIsActive")

carouselApiAtom.onChange((ctx, state) => {
  if (!state) return;

  const isFirstOpened = ctx.get(carouselIsFirstOpenedAtom)

  if (isFirstOpened) {
    const target = ctx.get(carouselSelectedIdxAtom);

    state.scrollTo(target, true);
  }
})

function getCarouselApi(ctx: Ctx) {
  const api = ctx.get(carouselApiAtom);
  if (!api) throw new Error("Carousel api is not defined");
  return api
}

const navigateToSlide = action((ctx, type: "next" | "prev") => {
  const api = getCarouselApi(ctx);

  if (type === 'prev') return api.scrollPrev()
  if (type === 'next') return api.scrollNext()
}, "navigateToSlide")

const initSlide = action((ctx, idx: number) => {
  carouselIsFirstOpenedAtom(ctx, true)
  carouselSelectedIdxAtom(ctx, idx)
}, "initSlide")

const ThreadImagesNavigation = reatomComponent(({ ctx }) => {
  return (
    <>
      <div
        className={threadImagesNavigation({ className: "left-0 top-1/2 h-2/3 hover:from-white/30" })}
        onClick={() => navigateToSlide(ctx, "prev")}
      >
        <ArrowLeft size={24} />
      </div>
      <div
        className={threadImagesNavigation({ className: "right-0 top-1/2 h-2/3 hover:to-white/30" })}
        onClick={() => navigateToSlide(ctx, "next")}
      >
        <ArrowRight size={24} />
      </div>
    </>
  );
}, "ThreadImagesNavigation")

const ThreadImagesList = reatomComponent(({ ctx }) => {
  const data = ctx.spy(threadImagesAtom)
  if (!data) return null;

  return (
    data.map((image, idx) => (
      <DialogTrigger
        key={idx}
        onClick={() => initSlide(ctx, idx)}
        className="flex items-center min-h-max h-full"
      >
        <img
          src={image}
          alt=""
          width={600}
          className={`object-cover h-full aspect-auto w-full rounded-lg duration-150 ease-in-out hover:brightness-75`}
          height={400}
          loading="lazy"
        />
      </DialogTrigger>
    ))
  )
}, "ThreadImagesList")

const ThreadCarouselContentList = reatomComponent(({ ctx }) => {
  const data = ctx.spy(threadImagesAtom)
  if (!data) return null;

  return (
    data.map((image, idx) => (
      <CarouselItem
        key={idx}
        className="flex justify-center items-center w-full max-h-[90vh] relative rounded-lg overflow-hidden"
        onMouseEnter={() => carouselIsHoveredAtom(ctx, true)}
        onMouseLeave={() => carouselIsHoveredAtom(ctx, false)}
      >
        <img
          src={image}
          alt=""
          className="max-h-full max-w-full rounded-lg object-contain"
          loading="lazy"
        />
      </CarouselItem>
    ))
  )
}, "ThreadCarouselContentList")

export const ThreadCarouselFooter = reatomComponent(({ ctx }) => {
  const thread = ctx.spy(threadAtom)
  if (!thread) return null;

  const isHovered = ctx.spy(carouselIsHoveredAtom)

  return (
    <div
      data-state={isHovered ? "hovered" : "unhovered"}
      className="flex absolute select-none duration-300 items-center justify-center w-full bottom-2 z-[1000] 
        data-[state=hovered]:opacity-100 data-[state=unhovered]:opacity-0"
    >
      <div className="flex flex-col gap-1 bg-black/60 backdrop-blur-sm rounded-lg py-1 px-4">
        <Typography textSize="large" className="font-semibold">
          {thread.title}
        </Typography>
      </div>
    </div>
  )
}, "ThreadCarouselFooter")

const ThreadCarouselImages = reatomComponent(({ ctx }) => {
  const carouselIsActive = ctx.spy(carouselIsActiveAtom)

  return (
    <Carousel
      setApi={(api) => api && carouselApiAtom(ctx, api)}
      opts={{
        align: "start",
        dragFree: false,
        loop: true,
        active: carouselIsActive,
        skipSnaps: true
      }}
      plugins={[
        WheelGesturesPlugin()
      ]}
    >
      {carouselIsActive && <ThreadImagesNavigation />}
      <CarouselContent className="max-h-[86vh]">
        <ThreadCarouselContentList />
      </CarouselContent>
    </Carousel>
  )
}, "ThreadCarouselImages")

export const ThreadImages = () => {
  return (
    <Dialog>
      <div
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 min-h-[200px] 
          max-h-[200px] lg:grid-rows-1 rounded-lg overflow-y-hidden overflow-x-auto gap-2 items-start w-full"
      >
        <ThreadImagesList />
      </div>
      <DialogContent className="bg-transparent flex justify-center items-center max-w-[90vw] max-h-[90vh]">
        <DialogTitle className="hidden"></DialogTitle>
        <ThreadCarouselImages />
        <ThreadCarouselFooter />
      </DialogContent>
    </Dialog >
  );
}