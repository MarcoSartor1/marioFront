'use server';

import { auth } from '@/auth.config';
import { OrderStatus } from '@/interfaces';
import { apiPatch } from '@/lib/api';

export const updateOrderStatus = async (orderId: string, status: OrderStatus, trackingCode?: string) => {
  const session = await auth();

  if (session?.user.role !== 'admin') {
    return { ok: false, message: 'No autorizado' };
  }

  try {
    const body: Record<string, unknown> = { status };
    if (trackingCode) body.trackingCode = trackingCode;
    await apiPatch(`/orders/${orderId}/status`, body);
    return { ok: true };
  } catch (error) {
    console.log(error);
    return { ok: false, message: 'No se pudo actualizar el estado de la orden' };
  }
};
