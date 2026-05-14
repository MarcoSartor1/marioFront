'use server';


import { AuthError } from '@auth/core/errors';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { signIn } from '@/auth.config';

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
    if (
      (error as any)?.message === 'RateLimitExceeded' ||
      (error as any)?.cause?.message === 'RateLimitExceeded'
    ) return 'RateLimit';
    if (error instanceof AuthError || (error as any)?.type === 'CredentialsSignin' || (error as any)?.message === 'CredentialsSignin') {
      return 'CredentialsSignin';
    }
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

