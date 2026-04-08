'use server';

import { auth } from '@/auth.config';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import bcryptjs from 'bcryptjs';

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

  const userId = (session.user as any).id;

  try {
    const updateData: Record<string, string> = {};

    if (data.name) {
      updateData.name = data.name;
    }

    if (data.newPassword) {
      if (!data.currentPassword) {
        return { ok: false, message: 'Debes ingresar tu contraseña actual para cambiarla' };
      }

      const dbUser = await prisma.user.findUnique({ where: { id: userId } });
      if (!dbUser) {
        return { ok: false, message: 'Usuario no encontrado' };
      }

      const passwordMatch = bcryptjs.compareSync(data.currentPassword, dbUser.password);
      if (!passwordMatch) {
        return { ok: false, message: 'La contraseña actual es incorrecta' };
      }

      updateData.password = bcryptjs.hashSync(data.newPassword, 10);
    }

    if (Object.keys(updateData).length === 0) {
      return { ok: false, message: 'No hay cambios para guardar' };
    }

    await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    revalidatePath('/profile');
    return { ok: true, message: 'Perfil actualizado correctamente' };

  } catch (error) {
    console.log(error);
    return { ok: false, message: 'Error al actualizar el perfil' };
  }
};
