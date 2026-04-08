'use server';

import { auth } from '@/auth.config';
import { apiGet } from '@/lib/api';

export const getOrdersByUser = async () => {
  const session = await auth();

  if (!session?.user) {
    return {
      ok: false,
      notAuthenticated: true,
      message: 'Debe de estar autenticado',
    };
  }

  try {
    const orders = await apiGet<any[]>('/orders/my');
    return { ok: true, orders };
  } catch (error) {
    console.log(error);
    return { ok: false, message: 'No se pudieron cargar las órdenes' };
  }
};
