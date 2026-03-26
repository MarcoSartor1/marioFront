'use server';

import { auth } from '@/auth.config';
import type { Address, Size } from '@/interfaces';
import { apiFetch } from '@/lib/api';

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: Size;
}

export const placeOrder = async (productIds: ProductToOrder[], address: Address) => {
  const session = await auth();

  if (!session?.user) {
    return {
      ok: false,
      message: 'No hay sesión de usuario',
    };
  }

  try {
    const body = {
      items: productIds,
      address: {
        ...address,
        countryId: address.country,
      },
    };

    const resp = await apiFetch('/orders', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      throw new Error(err?.message ?? 'No se pudo crear la orden');
    }

    const order = await resp.json();

    return {
      ok: true,
      order,
    };
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message,
    };
  }
};
