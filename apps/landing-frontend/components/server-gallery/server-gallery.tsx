'use client';

import Image from 'next/image';
import { useKeenSlider } from 'keen-slider/react';
import { GALLERY_LIST } from '#/shared/data/gallery/gallery-list';
import { Typography } from '#/ui/typography';
import { animation } from '#/components/intro/intro-main';
import dynamic from 'next/dynamic';

const DialogWrapper = dynamic(() =>
  import('#/components/wrappers/dialog-wrapper').then(m => m.DialogWrapper),
);

export const ServerGallery = () => {
  const [ sliderRef_carousel ] = useKeenSlider<HTMLDivElement>({
    loop: true,
    renderMode: 'performance',
    drag: true,
    breakpoints: {
      '(min-width: 320px)': {
        slides: { perView: 1, spacing: 24 },
      },
      '(min-width: 400px)': {
        slides: { perView: 1, spacing: 24 },
      },
      '(min-width: 768px)': {
        slides: { perView: 1, spacing: 24 },
      },
      '(min-width: 860px)': {
        slides: { perView: 2, spacing: 24 },
      },
      '(min-width: 1500px)': {
        slides: { perView: 3, spacing: 24 },
      },
    },
    created(s) {
      s.moveToIdx(3, true, animation);
    },
    updated(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation);
    },
    animationEnded(s) {
      s.moveToIdx(s.track.details.abs + 5, true, animation);
    },
  });
  
  return (
    <div className="flex flex-col gap-12 py-16 relative lg:py-16">
      <div className="borders_up" />
      <h2 className="text-3xl md:text-6xl lg:text-6xl xl:text-7xl text-center text-fuchsia-500">
        Немного скриншотов с сервера
      </h2>
      <div
        ref={sliderRef_carousel}
        className="flex items-center justify-start overflow-hidden relative"
      >
        {GALLERY_LIST.map(({ title, src }, idx) => (
          <div
            key={idx}
            className="keen-slider__slide group border-[#3d3d3d]/50 rounded-[8px] overflow-hidden !border-2 cursor-pointer relative"
          >
            <DialogWrapper
              title="Пикчи"
              classNames={{ content: 'gallery-image-content' }}
              trigger={
                <>
                  <div className="gallery-image-trigger">
                    <Typography className="text-neutral-50 text-lg xl:text-xl 2xl:text-2xl">
                      {title}
                    </Typography>
                  </div>
                  <div
                    className="w-[220px] h-[260px] sm:w-[220px] sm:h-[320px] md:w-[360px] md:h-[410px] lg:w-[440px] lg:h-[350px]"
                  >
                    <Image
                      loading="lazy"
                      src={src}
                      alt={title}
                      fill
                      className="rounded-[8px]"
                    />
                  </div>
                </>
              }
              content={
                <img
                  src={src}
                  alt={title}
                  width={1000}
                  loading="lazy"
                  height={800}
                  className="w-full h-full rounded-[8px]"
                />
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};