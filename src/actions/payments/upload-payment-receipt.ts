'use server';

import { auth } from '@/auth.config';

export const uploadPaymentReceipt = async (orderId: string, formData: FormData) => {
  const session = await auth();

  if (!session?.user) {
    return { ok: false, message: 'No autenticado' };
  }

  const backendToken = (session.user as any)?.token as string | undefined;

  try {
    const resp = await fetch(`${process.env.API_URL}/orders/${orderId}/payment-receipt`, {
      method: 'PATCH',
      headers: {
        ...(backendToken ? { Authorization: `Bearer ${backendToken}` } : {}),
      },
      body: formData,
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err?.message ?? 'No se pudo subir el comprobante');
    }

    const data = await resp.json();
    return { ok: true as const, paymentReceipt: data.paymentReceipt as string };
  } catch (error: any) {
    return { ok: false as const, message: error?.message ?? 'Error desconocido' };
  }
};
