import 'server-only';
import { v2 as cloudinary, type UploadApiOptions } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Evita la copia base64 del archivo; Cloudinary valida y convierte la imagen.
export async function uploadStoreImage(file: File, options: UploadApiOptions = {}): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { ...options, resource_type: 'image', format: 'webp', allowed_formats: ['jpg', 'jpeg', 'png', 'webp'] },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Cloudinary no devolvió la imagen'));
        resolve(result.secure_url);
      },
    );
    stream.on('error', reject);
    stream.end(buffer);
  });
}
