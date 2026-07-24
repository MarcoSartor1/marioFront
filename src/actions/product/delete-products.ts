'use server';

import { apiFetch } from '@/lib/api';

interface DeleteProductsResult {
  ok: boolean;
  message?: string;
  deleted?: number;
  blocked?: { id: string; title: string }[];
}

export const deleteProducts = async (ids: string[]): Promise<DeleteProductsResult> => {
  try {
    const resp = await apiFetch('/products', {
      method: 'DELETE',
      body: JSON.stringify({ ids }),
    });

    const body = await resp.json().catch(() => null);

    if (!resp.ok) {
      return { ok: false, message: body?.message ?? `Error ${resp.status}` };
    }

    return { ok: true, deleted: body?.deleted ?? ids.length, blocked: body?.blocked ?? [] };
  } catch (error) {
    console.error('[deleteProducts] ← error de red:', error);
    return { ok: false, message: 'No se pudieron eliminar los productos' };
  }
};
