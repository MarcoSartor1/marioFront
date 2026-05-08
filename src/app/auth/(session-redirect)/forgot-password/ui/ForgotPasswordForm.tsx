'use client';

import { useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import Link from 'next/link';
import clsx from 'clsx';
import { forgotPassword } from '@/actions';

type FormInputs = {
  email: string;
};

export const ForgotPasswordForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async ({ email }) => {
    await forgotPassword(email);
    setSubmitted(true);
  };

  if ( submitted ) {
    return (
      <div>
        <p className="text-gray-700 mb-6">
          Si el email está registrado, te enviamos un link para restablecer tu contraseña.
          Revisá tu bandeja de entrada.
        </p>
        <Link href="/auth/login" className="btn-secondary text-center block">
          Volver al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={ handleSubmit(onSubmit) } className="flex flex-col">
      <p className="text-gray-600 mb-5 text-sm">
        Ingresá tu email y te enviaremos un link para restablecer tu contraseña.
      </p>

      <label>Correo electrónico</label>
      <input
        className={ clsx(
          'px-5 py-2 border bg-gray-200 rounded mb-1',
          { 'border-red-500': errors.email }
        ) }
        type="email"
        autoFocus
        { ...register('email', { required: true, pattern: /^\S+@\S+$/i }) }
      />
      { errors.email && (
        <span className="text-red-500 text-sm mb-3">Ingresá un email válido</span>
      ) }

      <button
        type="submit"
        disabled={ isSubmitting }
        className={ clsx('mt-4', isSubmitting ? 'btn-disabled' : 'btn-primary') }
      >
        { isSubmitting ? 'Enviando...' : 'Enviar link' }
      </button>

      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500" />
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500" />
      </div>

      <Link href="/auth/login" className="btn-secondary text-center">
        Volver al inicio de sesión
      </Link>
    </form>
  );
};
