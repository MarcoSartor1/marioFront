'use server';

import type { Address } from '@/interfaces';
import { apiFetch } from '@/lib/api';

export const setUserAddress = async (address: Address, _userId: string) => {
  try {
    const body = {
      address: address.address,
      address2: address.address2,
      countryId: 'AR',
      city: address.city,
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      postalCode: address.postalCode,
    };

    const resp = await apiFetch('/addresses', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    if (!resp.ok) {
      const errBody = await resp.json().catch(() => ({}));
      console.error('[setUserAddress] status:', resp.status, 'body:', JSON.stringify(errBody));
      throw new Error(errBody?.message ?? 'No se pudo grabar la dirección');
    }

    const newAddress = await resp.json();

    return { ok: true, address: newAddress };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'No se pudo grabar la dirección',
    };
  }
};
