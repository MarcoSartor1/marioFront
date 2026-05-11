'use client';

import { useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import { SubmitHandler, useForm } from 'react-hook-form';

import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { login, registerUser } from '@/actions';

type FormInputs = {
  name: string;
  email: string;
  password: string;
};

export const RegisterForm = () => {
  const [errorMessage, setErrorMessage] = useState('');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormInputs>();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setErrorMessage('');
    const { name, email, password } = data;

    const resp = await registerUser(name, email, password);

    if ( !resp.ok ) {
      setErrorMessage(resp.message ?? 'No se pudo crear el usuario');
      return;
    }

    await login(email.toLowerCase(), password);
    setRegisteredEmail(email.toLowerCase());
  };

  if ( registeredEmail ) {
    return (
      <div>
        <p className="text-green-600 font-semibold text-lg mb-2">¡Cuenta creada exitosamente!</p>
        <p className="text-gray-700 mb-6">
          Te enviamos un email de verificación a <strong>{ registeredEmail }</strong>.
          Revisá tu bandeja para activar tu cuenta.
        </p>
        <Link href="/" className="btn-primary text-center block">
          Ir a la tienda
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={ handleSubmit(onSubmit) } className="flex flex-col">
      <label>Nombre completo</label>
      <input
        className={ clsx('px-5 py-2 border bg-gray-200 rounded mb-5', { 'border-red-500': errors.name }) }
        type="text"
        autoFocus
        { ...register('name', { required: true }) }
      />

      <label>Correo electrónico</label>
      <input
        className={ clsx('px-5 py-2 border bg-gray-200 rounded mb-5', { 'border-red-500': errors.email }) }
        type="email"
        { ...register('email', { required: true, pattern: /^\S+@\S+$/i }) }
      />

      <label>Contraseña</label>
      <div className="relative mb-1">
        <input
          className={ clsx('w-full px-5 py-2 border bg-gray-200 rounded pr-12', { 'border-red-500': errors.password }) }
          type={ showPassword ? 'text' : 'password' }
          { ...register('password', {
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
          onClick={ () => setShowPassword(p => !p) }
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          tabIndex={ -1 }
        >
          { showPassword ? <IoEyeOffOutline size={ 20 } /> : <IoEyeOutline size={ 20 } /> }
        </button>
      </div>
      { errors.password && (
        <span className="text-red-500 text-sm mb-4">{ errors.password.message }</span>
      ) }

      { errorMessage && (
        <span className="text-red-500 mb-3">{ errorMessage }</span>
      ) }

      <button
        type="submit"
        disabled={ isSubmitting }
        className={ clsx('mt-2', isSubmitting ? 'btn-disabled' : 'btn-primary') }
      >
        { isSubmitting ? 'Creando cuenta...' : 'Crear cuenta' }
      </button>

      <div className="flex items-center my-5">
        <div className="flex-1 border-t border-gray-500" />
        <div className="px-2 text-gray-800">O</div>
        <div className="flex-1 border-t border-gray-500" />
      </div>

      <Link href="/auth/login" className="btn-secondary text-center">
        Ingresar
      </Link>
    </form>
  );
};
