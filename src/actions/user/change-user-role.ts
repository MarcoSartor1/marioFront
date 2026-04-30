'use server';

import { auth } from '@/auth.config';
import { apiFetch } from '@/lib/api';
import { revalidatePath } from 'next/cache';


export const changeUserRole = async( userId: string, role: string ) => {

  const session = await auth();

  if ( session?.user.role !== 'admin' ) {
    return {
      ok: false,
      message: 'Debe de estar autenticado como admin'
    }
  }

  try {

    const newRole = role === 'admin' ? 'admin' : 'user';

    await apiFetch(`/users/${userId}`, {
      method: 'PATCH',
      body: JSON.stringify({ role: newRole }),
    });

    revalidatePath('/admin/users');

    return { ok: true };

  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'No se pudo actualizar el role, revisar logs'
    }
  }

}
