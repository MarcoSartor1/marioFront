'use server';

import { auth } from '@/auth.config';
import { apiFetch } from '@/lib/api';
import { revalidatePath, revalidateTag } from 'next/cache';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const requireAdmin = async () => {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    throw new Error('No autorizado');
  }
};

export const createHomeSlide = async (formData: FormData) => {
  try {
    await requireAdmin();

    const imageFile = formData.get('image') as File | null;
    if (!imageFile || imageFile.size === 0) {
      return { ok: false, message: 'Falta la imagen del slide' };
    }

    const buffer = await imageFile.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mime = imageFile.type || 'image/jpeg';
    const result = await cloudinary.uploader.upload(
      `data:${mime};base64,${base64}`,
      { folder: 'home-slides', format: 'webp' },
    );

    const body = {
      imageUrl: result.secure_url,
      title: (formData.get('title') as string) || undefined,
      subtitle: (formData.get('subtitle') as string) || undefined,
      linkUrl: (formData.get('linkUrl') as string) || undefined,
    };

    const resp = await apiFetch('/home-slides', {
      method: 'POST',
      body: JSON.stringify(body),
    });
    if (!resp.ok) {
      const errorBody = await resp.text();
      console.error('[createHomeSlide] backend error', resp.status, errorBody);
      return { ok: false, message: `No se pudo crear el slide (${resp.status})` };
    }

    const created = await resp.json();

    revalidateTag('home-slides');
    revalidatePath('/', 'layout');
    return { ok: true, slide: created };
  } catch (error) {
    console.error('[createHomeSlide]', error);
    return { ok: false, message: 'No se pudo crear el slide' };
  }
};

export const updateHomeSlide = async (
  id: string,
  data: { title?: string; subtitle?: string; linkUrl?: string; isActive?: boolean },
) => {
  try {
    await requireAdmin();

    const resp = await apiFetch(`/home-slides/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    if (!resp.ok) {
      const errorBody = await resp.text();
      console.error('[updateHomeSlide] backend error', resp.status, errorBody);
      return { ok: false, message: `No se pudo actualizar el slide (${resp.status})` };
    }

    revalidateTag('home-slides');
    revalidatePath('/', 'layout');
    return { ok: true };
  } catch (error) {
    console.error('[updateHomeSlide]', error);
    return { ok: false, message: 'No se pudo actualizar el slide' };
  }
};

export const deleteHomeSlide = async (id: string) => {
  try {
    await requireAdmin();

    const resp = await apiFetch(`/home-slides/${id}`, { method: 'DELETE' });
    if (!resp.ok) {
      const errorBody = await resp.text();
      console.error('[deleteHomeSlide] backend error', resp.status, errorBody);
      return { ok: false, message: `No se pudo eliminar el slide (${resp.status})` };
    }

    revalidateTag('home-slides');
    revalidatePath('/', 'layout');
    return { ok: true };
  } catch (error) {
    console.error('[deleteHomeSlide]', error);
    return { ok: false, message: 'No se pudo eliminar el slide' };
  }
};

export const reorderHomeSlides = async (ids: string[]) => {
  try {
    await requireAdmin();

    const resp = await apiFetch('/home-slides/reorder', {
      method: 'PATCH',
      body: JSON.stringify({ ids }),
    });
    if (!resp.ok) {
      const errorBody = await resp.text();
      console.error('[reorderHomeSlides] backend error', resp.status, errorBody);
      return { ok: false, message: `No se pudo reordenar (${resp.status})` };
    }

    revalidateTag('home-slides');
    revalidatePath('/', 'layout');
    return { ok: true };
  } catch (error) {
    console.error('[reorderHomeSlides]', error);
    return { ok: false, message: 'No se pudo reordenar' };
  }
};
