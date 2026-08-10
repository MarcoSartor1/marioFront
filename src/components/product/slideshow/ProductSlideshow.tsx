'use client';

import { useState } from 'react';

import { Swiper as SwiperObject } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode, Navigation, Thumbs } from 'swiper/modules';


import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

import './slideshow.css';
import { ProductImage } from '../product-image/ProductImage';
import { ProductImageLightbox } from './ProductImageLightbox';



interface Props {
  images: string[];
  title: string;
  className?: string;
}



export const ProductSlideshow = ( { images, title, className }: Props ) => {

  const [ thumbsSwiper, setThumbsSwiper ] = useState<SwiperObject>();
  const [ mainSwiper, setMainSwiper ] = useState<SwiperObject>();
  const [ lightboxIndex, setLightboxIndex ] = useState<number | null>(null);

  const openLightbox = () => {
    mainSwiper?.autoplay?.stop();
    setLightboxIndex(mainSwiper?.activeIndex ?? 0);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    mainSwiper?.autoplay?.start();
  };

  return (
    <div className={ className }>

      <Swiper
        style={ {
          '--swiper-navigation-color': '#fff',
          '--swiper-pagination-color': '#fff',
        } as React.CSSProperties
        }
        spaceBetween={ 10 }
        navigation={ true }
        autoplay={{
          delay: 2500
        }}
        thumbs={ {
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null
        } }
        modules={ [ FreeMode, Navigation, Thumbs, Autoplay ] }
        onSwiper={ setMainSwiper }
        className="mySwiper2"
      >

        {
          images.map( image => (
            <SwiperSlide key={ image }>
              <div className="w-full h-full cursor-zoom-in" onClick={ openLightbox }>
                <ProductImage
                  width={ 1024 }
                  height={ 800 }
                  src={ image }
                  alt={ title }
                  className="rounded-lg object-fill"
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


      <Swiper
        onSwiper={ setThumbsSwiper }
        spaceBetween={ 10 }
        slidesPerView={ 4 }
        freeMode={ true }
        watchSlidesProgress={ true }
        modules={ [ FreeMode, Navigation, Thumbs ] }
        className="mySwiper"
      >
        {
          images.map( image => (
            <SwiperSlide key={ image }>
              <ProductImage
                width={ 300 }
                height={ 300 }
                src={ image }
                alt={ title }
                className="rounded-lg object-fill"
              />
            </SwiperSlide>

          ) )
        }
      </Swiper>

    </div>
  );
};