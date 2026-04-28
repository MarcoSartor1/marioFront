'use server';

import { apiFetch } from '@/lib/api';
import { revalidatePath } from 'next/cache';

export const updatePublishedStatus = async (isPublished: boolean) => {
  try {
    const resp = await apiFetch('/config', {
      method: 'PATCH',
      body: JSON.stringify({ isPublished }),
    });

    const body = await resp.json().catch(() => null);

    if (!resp.ok) {
      return { ok: false, message: `Error ${resp.status}: ${JSON.stringify(body)}` };
    }

    revalidatePath('/', 'layout');
    return { ok: true };
  } catch (error) {
    console.error('[updatePublishedStatus]', error);
    return { ok: false, message: 'No se pudo actualizar el estado de publicación' };
  }
};
