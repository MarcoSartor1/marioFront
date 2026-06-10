'use server';

import { apiFetch } from '@/lib/api';

interface VerifyPaymentResponse {
  isPaid: boolean;
  status: string;
}

export const verifyPayment = async (paymentId: string) => {
  try {
    const resp = await apiFetch(`/payment/verify/${paymentId}`, {
      method: 'POST',
    });

    if (!resp.ok) {
      return { ok: false as const, message: `Error al verificar el pago: ${resp.status}` };
    }

    const data: VerifyPaymentResponse = await resp.json();

    return { ok: true as const, isPaid: data.isPaid, status: data.status };
  } catch (error: any) {
    return { ok: false as const, message: error?.message };
  }
};
