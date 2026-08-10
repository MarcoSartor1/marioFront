'use client';

import { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Zoom, Keyboard } from 'swiper/modules';
import { IoClose } from 'react-icons/io5';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/zoom';

interface Props {
  images: string[];
  title: string;
  initialIndex: number;
  onClose: () => void;
}

const resolveSrc = (src: string) => (src.startsWith('http') ? src : `/products/${src}`);

export const ProductImageLightbox = ({ images, title, initialIndex, onClose }: Props) => {
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center">
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar"
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
      >
        <IoClose className="w-6 h-6" />
      </button>

      <Swiper
        style={{
          '--swiper-navigation-color': '#fff',
        } as React.CSSProperties}
        initialSlide={initialIndex}
        navigation
        zoom={{ maxRatio: 3 }}
        keyboard={{ enabled: true }}
        modules={[Navigation, Zoom, Keyboard]}
        className="w-full h-full max-w-5xl max-h-[90vh]"
      >
        {images.map((image) => (
          <SwiperSlide key={image} className="flex items-center justify-center">
            <div className="swiper-zoom-container">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolveSrc(image)}
                alt={title}
                className="max-w-full max-h-[90vh] object-contain select-none"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <p className="absolute bottom-4 inset-x-0 text-center text-white/60 text-xs">
        Doble click / pellizcá para hacer zoom
      </p>
    </div>
  );
};
