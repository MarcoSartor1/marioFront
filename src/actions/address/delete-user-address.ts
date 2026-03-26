'use server';

import { apiDelete } from '@/lib/api';

export const deleteUserAddress = async (_userId: string) => {
  try {
    await apiDelete('/addresses');
    return { ok: true };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'No se pudo eliminar la direccion',
    };
  }
};
