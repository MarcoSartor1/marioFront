'use server';

import { auth } from '@/auth.config';
import { revalidatePath } from 'next/cache';

export const createUpdateCategory = async (id: string | null, name: string) => {
  const session = await auth();
  const token = (session?.user as any)?.token as string | undefined;

  try {
    const resp = await fetch(
      `${process.env.API_URL}/categories${id ? `/${id}` : ''}`,
      {
        method: id ? 'PATCH' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ name: name.trim() }),
      }
    );

    if (!resp.ok) {
      const data = await resp.json();
      return { ok: false, message: data.message ?? 'No se pudo guardar la categoría' };
    }

    const category = await resp.json();
    revalidatePath('/admin/categories');
    return { ok: true, category };
  } catch (error) {
    console.log(error);
    return { ok: false, message: 'No se pudo guardar la categoría' };
  }
};
