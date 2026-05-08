'use server';

import { apiFetch } from '@/lib/api';

export const resendVerification = async () => {
  try {
    const resp = await apiFetch('/auth/resend-verification', { method: 'POST' });
    const data = await resp.json();

    if (!resp.ok) {
      return { ok: false, message: data.message ?? 'No se pudo reenviar el email' };
    }

    return { ok: true };
  } catch {
    return { ok: false, message: 'No se pudo reenviar el email' };
  }
};
