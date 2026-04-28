'use server';

import { auth } from '@/auth.config';
import { apiPatch } from '@/lib/api';
import { revalidatePath, revalidateTag } from 'next/cache';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
      const buffer = await logoFile.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      const mime = logoFile.type || 'image/png';
      const result = await cloudinary.uploader.upload(
        `data:${mime};base64,${base64}`,
        { folder: 'store-config', public_id: 'logo', overwrite: true, invalidate: true },
      );
      logoUrl = result.secure_url;
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
