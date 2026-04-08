'use server';

import { auth } from '@/auth.config';
import { OrderStatus } from '@/interfaces';
import { apiPatch } from '@/lib/api';

export const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
  const session = await auth();

  if (session?.user.role !== 'admin') {
    return { ok: false, message: 'No autorizado' };
  }

  try {
    await apiPatch(`/orders/${orderId}/status`, { status });
    return { ok: true };
  } catch (error) {
    console.log(error);
    return { ok: false, message: 'No se pudo actualizar el estado de la orden' };
  }
};
