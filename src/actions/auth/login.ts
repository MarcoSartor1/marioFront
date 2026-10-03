'use server';


import { AuthError } from '@auth/core/errors';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { signIn } from '@/auth.config';
import { getLoginFailure } from '@/lib/login-error';

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect: false,
    });

    return 'Success';

  } catch (error) {
    if (isRedirectError(error)) throw error;
    const failure = getLoginFailure(error);
    if (failure) return failure;
    if (error instanceof AuthError) return 'AuthUnavailable';
    throw error;
  }
}


export const login = async(email:string, password: string) => {

  try {

    await signIn('credentials',{ email, password })

    return {ok: true};
    
  } catch (error) {
    if (isRedirectError(error)) throw error;
    console.log(error);
    return {
      ok: false,
      message: 'No se pudo iniciar sesión'
    }

  }


}

