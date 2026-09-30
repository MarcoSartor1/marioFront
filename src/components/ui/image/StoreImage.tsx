'use client';

import Image, { type ImageProps } from 'next/image';
import { cloudinaryImageLoader, isCloudinaryImage } from '@/lib/cloudinary-image';

// Cloudinary genera el srcSet; las fuentes locales y previews se sirven directamente.
// Ninguna de estas imágenes requiere procesamiento en el servidor de Next.js.
export default function StoreImage(props: ImageProps) {
  const cloudinary = typeof props.src === 'string' && isCloudinaryImage(props.src);
  return <Image {...props} alt={props.alt} loader={cloudinary ? cloudinaryImageLoader : undefined}
    unoptimized={!cloudinary || props.unoptimized} />;
}
