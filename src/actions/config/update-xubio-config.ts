'use server';

import { auth } from '@/auth.config';
import { apiPatch } from '@/lib/api';
import { revalidatePath, revalidateTag } from 'next/cache';

export interface XubioConfigInput {
  xubioStockAdjustmentDoc?: string | null;
  xubioListaPrecioId?: number | null;
  xubioDepositoId?: number | null;
}

export const updateXubioConfig = async (data: XubioConfigInput) => {
  const session = await auth();

  if (session?.user.role !== 'admin') {
    return { ok: false, message: 'No autorizado' };
  }

  try {
    await apiPatch('/config', data);
    revalidateTag('store-config');
    revalidatePath('/admin/config');
    return { ok: true };
  } catch (error) {
    console.error(error);
    return { ok: false, message: 'No se pudo guardar la configuración de Xubio' };
  }
};
