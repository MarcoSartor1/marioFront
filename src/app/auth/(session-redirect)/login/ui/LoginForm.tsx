'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useFormState, useFormStatus } from 'react-dom';
import clsx from 'clsx';
import { IoInformationOutline, IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';

import { authenticate } from '@/actions';

export const LoginForm = () => {
  const [state, dispatch] = useFormState(authenticate, undefined);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if ( state === 'Success' ) {
      window.location.replace('/');
    }
  }, [state]);

  return (
    <form action={ dispatch } className="flex flex-col">
      <label htmlFor="email">Correo electrónico</label>
      <input
        className="px-5 py-2 border bg-gray-200 rounded mb-5"
        type="email"
        name="email"
      />

      <label htmlFor="password">Contraseña</label>
      <div className="relative mb-1">
        <input
          className="w-full px-5 py-2 border bg-gray-200 rounded pr-12"
          type={ showPassword ? 'text' : 'password' }
          name="password"
        />
        <button
          type="button"
          onClick={ () => setShowPassword(p => !p) }
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          tabIndex={ -1 }
        >
          { showPassword ? <IoEyeOffOutline size={ 20 } /> : <IoEyeOutline size={ 20 } /> }
        </button>
      </div>

      <Link
        href="/auth/forgot-password"
        className="text-sm text-right text-blue-600 hover:underline mb-4"
      >
        ¿Olvidaste tu contraseña?
      </Link>

      <div className="flex h-8 items-end space-x-1" aria-live="polite" aria-atomic="true">
        { state === 'CredentialsSignin' && (
          <div className="flex flex-row mb-2">
            <IoInformationOutline className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">Credenciales incorrectas</p>
          </div>
        ) }
        { state === 'RateLimit' && (
          <div className="flex flex-row mb-2">
            <IoInformationOutline className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-500">Demasiados intentos. Esperá un momento e intentá de nuevo.</p>
          </div>
        ) }
      </div>

      <LoginButton />

      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500" />
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500" />
      </div>

      <Link href="/auth/new-account" className="btn-secondary text-center">
        Crear una nueva cuenta
      </Link>
    </form>
  );
};

function LoginButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      className={ clsx({ 'btn-primary': !pending, 'btn-disabled': pending }) }
      disabled={ pending }
    >
      Ingresar
    </button>
  );
}
