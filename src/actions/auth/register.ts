'use server';


export const registerUser = async( name: string, email: string, password: string ) => {

  try {

    const resp = await fetch(`${ process.env.API_URL }/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email: email.toLowerCase(), password }),
    });

    if ( !resp.ok ) {
      const data = await resp.json();
      return { ok: false, message: data.message ?? 'No se pudo crear el usuario' };
    }

    const user = await resp.json();

    return {
      ok: true,
      user: { id: user.id, name: user.name, email: user.email },
      message: 'Usuario creado'
    }

  } catch (error) {
    console.log(error);
    return { ok: false, message: 'No se pudo crear el usuario' }
  }

}