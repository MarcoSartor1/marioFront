'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SubmitHandler, useForm } from 'react-hook-form';
import Link from 'next/link';
import clsx from 'clsx';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { resetPassword } from '@/actions';

type FormInputs = {
  newPassword: string;
  confirmPassword: string;
};

export const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') ?? '';
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async ({ newPassword }) => {
    setErrorMessage('');
    const resp = await resetPassword(token, newPassword);
    if ( !resp.ok ) {
      setErrorMessage(resp.message ?? 'Error al restablecer la contraseña');
      return;
    }
    setSuccess(true);
    setTimeout(() => router.replace('/auth/login'), 3000);
  };

  if ( !token ) {
    return (
      <div>
        <p className="text-red-500 mb-4">El enlace es inválido o ya expiró.</p>
        <Link href="/auth/forgot-password" className="btn-primary text-center block">
          Solicitar nuevo enlace
        </Link>
      </div>
    );
  }

  if ( success ) {
    return (
      <div>
        <p className="text-green-600 font-semibold mb-2">¡Contraseña restablecida correctamente!</p>
        <p className="text-gray-600 mb-4">Serás redirigido al inicio de sesión en unos segundos...</p>
        <Link href="/auth/login" className="btn-primary text-center block">
          Ir al inicio de sesión
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={ handleSubmit(onSubmit) } className="flex flex-col">
      <label>Nueva contraseña</label>
      <div className="relative mb-1">
        <input
          className={ clsx('w-full px-5 py-2 border bg-gray-200 rounded pr-12', { 'border-red-500': errors.newPassword }) }
          type={ showNewPassword ? 'text' : 'password' }
          autoFocus
          { ...register('newPassword', {
            required: 'La contraseña es obligatoria',
            minLength: { value: 8, message: 'Mínimo 8 caracteres' },
            validate: {
              hasUppercase: v => /[A-Z]/.test(v) || 'Debe tener al menos 1 mayúscula',
              hasNumber: v => /\d/.test(v) || 'Debe tener al menos 1 número',
            },
          }) }
        />
        <button
          type="button"
          onClick={ () => setShowNewPassword(p => !p) }
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          tabIndex={ -1 }
        >
          { showNewPassword ? <IoEyeOffOutline size={ 20 } /> : <IoEyeOutline size={ 20 } /> }
        </button>
      </div>
      { errors.newPassword && (
        <span className="text-red-500 text-sm mb-3">{ errors.newPassword.message }</span>
      ) }

      <label className="mt-3">Confirmar contraseña</label>
      <div className="relative mb-1">
        <input
          className={ clsx('w-full px-5 py-2 border bg-gray-200 rounded pr-12', { 'border-red-500': errors.confirmPassword }) }
          type={ showConfirmPassword ? 'text' : 'password' }
          { ...register('confirmPassword', {
            required: 'Confirmá tu contraseña',
            validate: v => v === watch('newPassword') || 'Las contraseñas no coinciden',
          }) }
        />
        <button
          type="button"
          onClick={ () => setShowConfirmPassword(p => !p) }
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          tabIndex={ -1 }
        >
          { showConfirmPassword ? <IoEyeOffOutline size={ 20 } /> : <IoEyeOutline size={ 20 } /> }
        </button>
      </div>
      { errors.confirmPassword && (
        <span className="text-red-500 text-sm mb-3">{ errors.confirmPassword.message }</span>
      ) }

      { errorMessage && (
        <span className="text-red-500 text-sm mb-3">{ errorMessage }</span>
      ) }

      <button
        type="submit"
        disabled={ isSubmitting }
        className={ clsx('mt-2', isSubmitting ? 'btn-disabled' : 'btn-primary') }
      >
        { isSubmitting ? 'Guardando...' : 'Restablecer contraseña' }
      </button>
    </form>
  );
};
