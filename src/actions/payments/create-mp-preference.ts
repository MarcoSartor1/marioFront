'use server';

import { auth } from '@/auth.config';
import { apiFetch } from '@/lib/api';

interface MpPreferenceResponse {
  preferenceId: string;
  initPoint: string;
  sandboxInitPoint: string;
}

export const createMpPreference = async (orderId: string) => {
  const session = await auth();

  if (!session?.user) {
    return { ok: false as const, message: 'No hay sesión de usuario' };
  }

  try {
    const resp = await apiFetch(`/payment/create-preference/${orderId}`, {
      method: 'POST',
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err?.message ?? 'No se pudo crear la preferencia de pago');
    }

    const data: MpPreferenceResponse = await resp.json();

    return {
      ok: true as const,
      preferenceId: data.preferenceId,
      initPoint: data.initPoint,
      sandboxInitPoint: data.sandboxInitPoint,
    };
  } catch (error: any) {
    return { ok: false as const, message: error?.message };
  }
};
