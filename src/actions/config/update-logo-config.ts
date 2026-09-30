'use server';

import { auth } from '@/auth.config';
import { apiPatch } from '@/lib/api';
import { revalidatePath, revalidateTag } from 'next/cache';
import { uploadStoreImage } from '@/lib/upload-store-image';
import { validateImageFiles } from '@/lib/image-upload-limits';

export const updateLogoConfig = async (formData: FormData) => {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    return { ok: false, message: 'No autorizado' };
  }

  const showTitleWithLogo = formData.get('showTitleWithLogo') === 'true';
  const logoFile = formData.get('logo') as File | null;

  try {
    let logoUrl: string | undefined;

    if (logoFile && logoFile.size > 0) {
      const imageError = validateImageFiles([logoFile], 1024 * 1024);
      if (imageError) return { ok: false, message: imageError };
      logoUrl = await uploadStoreImage(logoFile, {
        folder: 'store-config', public_id: 'logo', overwrite: true, invalidate: true,
      });
    }

    const patch: Record<string, unknown> = { showTitleWithLogo };
    if (logoUrl) patch.logoUrl = logoUrl;

    await apiPatch('/config', patch);
    revalidateTag('store-config');
    revalidatePath('/', 'layout');

    return { ok: true };
  } catch (error) {
    console.error('[updateLogoConfig]', error);
    return { ok: false, message: 'No se pudo actualizar el logo' };
  }
};

export const removeStoreLogo = async () => {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    return { ok: false, message: 'No autorizado' };
  }

  try {
    await apiPatch('/config', { logoUrl: null });
    revalidateTag('store-config');
    revalidatePath('/', 'layout');
    return { ok: true };
  } catch {
    return { ok: false, message: 'No se pudo eliminar el logo' };
  }
};
