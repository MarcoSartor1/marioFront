'use server';

import { auth } from '@/auth.config';
import { revalidatePath } from 'next/cache';

export const deleteCategory = async (id: string) => {
  const session = await auth();
  const token = (session?.user as any)?.token as string | undefined;

  try {
    const resp = await fetch(`${process.env.API_URL}/categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (!resp.ok) {
      const data = await resp.json();
      return { ok: false, message: data.message ?? 'No se pudo eliminar la categoría' };
    }

    revalidatePath('/admin/categories');
    return { ok: true };
  } catch (error) {
    console.log(error);
    return { ok: false, message: 'No se pudo eliminar la categoría' };
  }
};
