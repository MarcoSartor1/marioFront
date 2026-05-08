'use server';

export const resetPassword = async (token: string, newPassword: string) => {
  try {
    const resp = await fetch(`${process.env.API_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      return { ok: false, message: data.message ?? 'Token inválido o expirado' };
    }

    return { ok: true };
  } catch {
    return { ok: false, message: 'Error al restablecer la contraseña' };
  }
};
