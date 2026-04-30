'use server';

import { auth } from '@/auth.config';
import type { Address, PaymentMethod } from '@/interfaces';
import { apiFetch } from '@/lib/api';

interface ProductToOrder {
  productId: string;
  quantity: number;
  size: string;
  price: number;
}

export const placeOrder = async (
  productIds: ProductToOrder[],
  address: Address,
  paymentMethod: PaymentMethod = 'mercadopago',
) => {
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
      paymentMethod,
      address: {
        firstName: address.firstName,
        lastName: address.lastName,
        address: address.address,
        address2: address.address2,
        postalCode: address.postalCode,
        city: address.city,
        phone: address.phone,
        countryId: 'AR',
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
