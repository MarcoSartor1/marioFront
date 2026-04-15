'use server';

import { apiFetch } from '@/lib/api';

export const toggleProductPublish = async (ids: string[], publish: boolean) => {
  const payload = { ids, publish };
  console.log('[toggleProductPublish] → payload:', JSON.stringify(payload, null, 2));

  try {
    const resp = await apiFetch('/products/publish', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });

    const body = await resp.json().catch(() => null);
    console.log(`[toggleProductPublish] ← status: ${resp.status}`, JSON.stringify(body, null, 2));

    if (!resp.ok) {
      return { ok: false, message: `Error ${resp.status}: ${JSON.stringify(body)}` };
    }

    return { ok: true };
  } catch (error) {
    console.error('[toggleProductPublish] ← error de red:', error);
    return { ok: false, message: 'No se pudo actualizar el estado de los productos' };
  }
};
