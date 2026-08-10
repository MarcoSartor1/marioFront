'use client';

import { useState } from 'react';
import { Swiper as SwiperObject } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { ProductImage } from '../product-image/ProductImage';
import { Autoplay, FreeMode, Navigation, Pagination } from 'swiper/modules';
import { ProductImageLightbox } from './ProductImageLightbox';


import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/pagination';

import './slideshow.css';



interface Props {
  images: string[];
  title: string;
  className?: string;
}



export const ProductMobileSlideshow = ( { images, title, className }: Props ) => {

  const [ swiperInstance, setSwiperInstance ] = useState<SwiperObject>();
  const [ lightboxIndex, setLightboxIndex ] = useState<number | null>(null);

  const openLightbox = () => {
    swiperInstance?.autoplay?.stop();
    setLightboxIndex(swiperInstance?.activeIndex ?? 0);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    swiperInstance?.autoplay?.start();
  };

  return (
    <div className={ className }>

      <Swiper
        style={{ height: 'auto' }}
        pagination
        autoplay={{
          delay: 2500
        }}
        modules={ [ FreeMode, Autoplay, Pagination ] }
        onSwiper={ setSwiperInstance }
      >

        {
          images.map( image => (
            <SwiperSlide key={ image }>
              <div className="w-full" onClick={ openLightbox }>
                <ProductImage
                  width={ 600 }
                  height={ 600 }
                  src={ image }
                  alt={ title }
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                />
              </div>
            </SwiperSlide>
          ) )
        }
      </Swiper>

      {lightboxIndex !== null && (
        <ProductImageLightbox
          images={images}
          title={title}
          initialIndex={lightboxIndex}
          onClose={closeLightbox}
        />
      )}

    </div>
  );
};