'use server';

import { v2 as cloudinary } from 'cloudinary';
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const deleteProductImage = async (imageUrl: string) => {
  if (!imageUrl.startsWith('http')) {
    return { ok: false, error: 'No se pueden borrar imagenes de FS' };
  }

  const imageName = imageUrl.split('/').pop()?.split('.')[0] ?? '';

  try {
    await cloudinary.uploader.destroy(imageName);
    return { ok: true };
  } catch (error) {
    console.log(error);
    return { ok: false, message: 'No se pudo eliminar la imagen' };
  }
};
