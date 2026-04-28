'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { ProductImage } from '../product-image/ProductImage';
import { Autoplay, FreeMode, Navigation, Pagination } from 'swiper/modules';


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


  return (
    <div className={ className }>

      <Swiper
        style={{ height: 'auto' }}
        pagination
        autoplay={{
          delay: 2500
        }}
        modules={ [ FreeMode, Autoplay, Pagination ] }
      >

        {
          images.map( image => (
            <SwiperSlide key={ image }>
              <ProductImage
                width={ 600 }
                height={ 600 }
                src={ image }
                alt={ title }
                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
              />
            </SwiperSlide>
          ) )
        }
      </Swiper>



    </div>
  );
};