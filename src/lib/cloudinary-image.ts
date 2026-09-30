import type { ImageLoaderProps } from 'next/image';

// No modificar URLs firmadas ni fuentes locales/externas.
export function isCloudinaryImage(src: string): boolean {
  return /^https:\/\/res\.cloudinary\.com\/[^/]+\/image\/upload\//.test(src)
    && !/\/s--[^/]+--\//.test(src);
}

export function cloudinaryImageLoader({ src, width, quality }: ImageLoaderProps): string {
  if (!isCloudinaryImage(src)) return src;
  const url = new URL(src);
  const marker = '/image/upload/';
  const start = url.pathname.indexOf(marker) + marker.length;
  const asset = url.pathname.slice(start);
  // Aplicar el tamaño después de transformaciones existentes (por ejemplo, rotación).
  const version = asset.match(/(?:^|\/)v\d+\//);
  const rotation = asset.match(/^(?:a_\d+\/)+/);
  const offset = version ? version.index! + (version[0].startsWith('/') ? 1 : 0) : (rotation?.[0].length ?? 0);
  const transform = `c_limit,w_${width},f_auto,q_${quality ?? 'auto'}/`;
  url.pathname = url.pathname.slice(0, start) + asset.slice(0, offset) + transform + asset.slice(offset);
  return url.toString();
}
