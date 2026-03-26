'use server';

import { auth } from '@/auth.config';
import { apiGet } from '@/lib/api';

export const getOrderById = async (id: string) => {
  const session = await auth();

  if (!session?.user) {
    return {
      ok: false,
      message: 'Debe de estar autenticado',
    };
  }

  try {
    const order = await apiGet<any>(`/orders/${id}`);

    if (!order) throw new Error(`${id} no existe`);

    return {
      ok: true,
      order,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'Orden no existe',
    };
  }
};
