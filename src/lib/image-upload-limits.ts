export const MAX_PRODUCT_PHOTOS = 5;
export const MAX_IMAGE_BYTES = 2 * 1024 * 1024;
export const MAX_PRODUCT_UPLOAD_BYTES = 8 * 1024 * 1024;

export function validateImageFiles(files: readonly File[], maxBytes = MAX_IMAGE_BYTES): string | null {
  for (const file of files) {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      return 'Elegí imágenes JPG, PNG o WebP.';
    }
    if (file.size > maxBytes) return `Cada imagen puede pesar hasta ${maxBytes / 1024 / 1024} MB.`;
  }
  if (files.reduce((sum, file) => sum + file.size, 0) > MAX_PRODUCT_UPLOAD_BYTES) {
    return 'Las imágenes nuevas pueden sumar hasta 8 MB por guardado.';
  }
  return null;
}
