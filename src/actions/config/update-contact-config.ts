'use server';

import { auth } from '@/auth.config';
import { apiPatch } from '@/lib/api';
import { revalidatePath, revalidateTag } from 'next/cache';

export interface ContactConfigInput {
  address?: string | null;
  mapLat?: number | null;
  mapLng?: number | null;
  businessHours?: string | null;
  whatsapp?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  isContactPagePublished?: boolean;
}

export const updateContactConfig = async (data: ContactConfigInput) => {
  const session = await auth();
  if (session?.user.role !== 'admin') {
    return { ok: false, message: 'No autorizado' };
  }

  try {
    const config = await apiPatch('/config', data);
    revalidateTag('store-config');
    revalidatePath('/contact');
    revalidatePath('/admin/contact');
    return { ok: true, config };
  } catch {
    return { ok: false, message: 'Error al actualizar la configuración de contacto' };
  }
};
