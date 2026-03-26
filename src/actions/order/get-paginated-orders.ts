'use server';

import { auth } from '@/auth.config';
import { apiGet } from '@/lib/api';

export const getPaginatedOrders = async () => {
  const session = await auth();

  if (session?.user.role !== 'admin') {
    return {
      ok: false,
      message: 'Debe de estar autenticado',
    };
  }

  try {
    const orders = await apiGet<any[]>('/orders');
    return { ok: true, orders };
  } catch (error) {
    console.log(error);
    return { ok: false, message: 'No se pudieron cargar las órdenes' };
  }
};
