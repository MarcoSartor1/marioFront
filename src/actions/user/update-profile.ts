'use server';

import { auth } from '@/auth.config';
import { apiFetch } from '@/lib/api';
import { revalidatePath } from 'next/cache';

interface UpdateProfileData {
  name?: string;
  currentPassword?: string;
  newPassword?: string;
}

export const updateProfile = async (data: UpdateProfileData) => {
  const session = await auth();
  if (!session?.user) {
    return { ok: false, message: 'No autenticado' };
  }

  if (data.newPassword && !data.currentPassword) {
    return { ok: false, message: 'Debes ingresar tu contraseña actual para cambiarla' };
  }

  const payload: Record<string, string> = {};
  if (data.name) payload.name = data.name;
  if (data.newPassword) {
    payload.currentPassword = data.currentPassword!;
    payload.newPassword = data.newPassword;
  }

  if (Object.keys(payload).length === 0) {
    return { ok: false, message: 'No hay cambios para guardar' };
  }

  try {
    await apiFetch('/auth/profile', {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });

    revalidatePath('/profile');
    return { ok: true, message: 'Perfil actualizado correctamente' };

  } catch (error) {
    console.log(error);
    return { ok: false, message: 'Error al actualizar el perfil' };
  }
};
