'use server';

export const forgotPassword = async (email: string) => {
  try {
    await fetch(`${process.env.API_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
  } catch {
    // Silently fail — never reveal whether the email is registered
  }

  return { ok: true };
};
