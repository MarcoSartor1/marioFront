'use server';

import { auth } from '@/auth.config';
import { apiPatch } from '@/lib/api';
import { revalidatePath, revalidateTag } from 'next/cache';

export const updateThemeConfig = async (formData: FormData) => {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    return { ok: false, message: 'No autorizado' };
  }

  const primaryColor = formData.get('primaryColor') as string;
  const secondaryColor = formData.get('secondaryColor') as string;

  try {
    await apiPatch('/config', { primaryColor, secondaryColor });
    revalidateTag('store-config');
    revalidatePath('/', 'layout');
    return { ok: true };
  } catch (error) {
    console.error('[updateThemeConfig]', error);
    return { ok: false, message: 'No se pudo actualizar los colores' };
  }
};
