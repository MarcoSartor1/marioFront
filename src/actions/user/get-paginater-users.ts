'use server';

import { auth } from '@/auth.config';
import { apiGet } from '@/lib/api';

export const getPaginatedUsers = async () => {
  const session = await auth();

  if (session?.user.role !== 'admin') {
    return {
      ok: false,
      message: 'Debe de ser un usuario administrador',
    };
  }

  try {
    const users = await apiGet<any[]>('/users');
    return { ok: true, users };
  } catch (error) {
    console.log(error);
    return { ok: false, message: 'No se pudieron cargar los usuarios' };
  }
};
