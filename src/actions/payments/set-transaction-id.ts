'use server';

import { apiFetch } from '@/lib/api';

export const setTransactionId = async (orderId: string, transactionId: string) => {
  try {
    const resp = await apiFetch(`/orders/${orderId}/transaction`, {
      method: 'PATCH',
      body: JSON.stringify({ transactionId }),
    });

    if (!resp.ok) {
      return {
        ok: false,
        message: `No se encontró una orden con el ${orderId}`,
      };
    }

    return { ok: true };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'No se pudo actualizar el id de la transacción',
    };
  }
};
