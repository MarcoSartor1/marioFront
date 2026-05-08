'use server';

export const verifyEmail = async (token: string) => {
  try {
    const resp = await fetch(`${process.env.API_URL}/auth/verify-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      return { ok: false, message: data.message ?? 'Token inválido o expirado' };
    }

    return { ok: true };
  } catch {
    return { ok: false, message: 'Error al verificar el email' };
  }
};
