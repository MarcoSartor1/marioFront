'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { titleFont } from '@/config/fonts';
import type { HomeSlide } from '@/actions/config/get-home-slides';

interface Props {
  slides: HomeSlide[];
}

const AUTOPLAY_MS = 3000;

export const HeroSlider = ({ slides }: Props) => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const goTo = useCallback((i: number) => {
    setIndex((i + slides.length) % slides.length);
  }, [slides.length]);

  const startAutoplay = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (slides.length <= 1) return;
    timerRef.current = setInterval(() => {
      setIndex(prev => (prev + 1) % slides.length);
    }, AUTOPLAY_MS);
  }, [slides.length]);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startAutoplay]);

  if (slides.length === 0) return null;

  const slide = slides[index];
  const content = (
    <>
      <Image
        src={slide.imageUrl}
        alt={slide.title ?? 'Costumbres Argentinas'}
        fill
        priority={index === 0}
        className="object-cover"
        unoptimized
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

      {(slide.title || slide.subtitle) && (
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-10">
          {slide.title && (
            <h2 className={`${titleFont.className} text-2xl sm:text-4xl font-bold text-white uppercase tracking-tight drop-shadow`}>
              {slide.title}
            </h2>
          )}
          {slide.subtitle && (
            <p className="text-white/90 mt-2 max-w-md text-sm sm:text-base">
              {slide.subtitle}
            </p>
          )}
        </div>
      )}
    </>
  );

  return (
    <div
      className="relative mt-6 mb-8 rounded-2xl overflow-hidden w-full aspect-[12/5] min-h-[220px] max-h-[480px] bg-stone-200"
      onMouseEnter={() => timerRef.current && clearInterval(timerRef.current)}
      onMouseLeave={startAutoplay}
    >
      {slide.linkUrl ? (
        <Link href={slide.linkUrl} className="block w-full h-full relative">
          {content}
        </Link>
      ) : (
        <div className="w-full h-full relative">{content}</div>
      )}

      {slides.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(index - 1)}
            aria-label="Anterior"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-stone-700 shadow"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={() => goTo(index + 1)}
            aria-label="Siguiente"
            className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 hover:bg-white flex items-center justify-center text-stone-700 shadow"
          >
            ›
          </button>

          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Ir al slide ${i + 1}`}
                className={`w-2 h-2 rounded-full transition-all ${
                  i === index ? 'bg-white w-5' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
