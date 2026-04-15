'use server';

import { apiFetch } from '@/lib/api';

export interface XubioSyncResult {
  created: number;
  skipped: number;
  total: number;
}

export const syncXubioProducts = async (): Promise<
  { ok: true; data: XubioSyncResult } | { ok: false; message: string }
> => {
  try {
    const resp = await apiFetch('/xubio/sync-products', { method: 'POST' });
    const body = await resp.json().catch(() => null);

    console.log(`[syncXubioProducts] ← status: ${resp.status}`, JSON.stringify(body, null, 2));

    if (!resp.ok) {
      const msg = body?.message ?? `Error ${resp.status}`;
      return { ok: false, message: Array.isArray(msg) ? msg.join(', ') : String(msg) };
    }

    return { ok: true, data: body as XubioSyncResult };
  } catch (error) {
    console.error('[syncXubioProducts] ← error de red:', error);
    return { ok: false, message: 'No se pudo conectar con el servidor' };
  }
};
