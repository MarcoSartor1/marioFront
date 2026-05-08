'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { verifyEmail, resendVerification } from '@/actions';

export const VerifyEmailContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [resendStatus, setResendStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  useEffect(() => {
    if ( !token ) {
      setStatus('error');
      return;
    }
    verifyEmail(token).then(resp => {
      if ( resp.ok ) {
        setStatus('success');
        setTimeout(() => router.replace('/'), 3000);
      } else {
        setStatus('error');
      }
    });
  }, [token, router]);

  const handleResend = async () => {
    setResendStatus('sending');
    const resp = await resendVerification();
    setResendStatus(resp.ok ? 'sent' : 'error');
  };

  if ( status === 'loading' ) {
    return <p className="text-gray-600">Verificando tu email...</p>;
  }

  if ( status === 'success' ) {
    return (
      <div>
        <p className="text-green-600 font-semibold text-lg mb-2">¡Email verificado correctamente!</p>
        <p className="text-gray-600 mb-4">Serás redirigido al inicio en unos segundos...</p>
        <Link href="/" className="btn-primary text-center block">Ir al inicio</Link>
      </div>
    );
  }

  return (
    <div>
      <p className="text-red-500 font-semibold text-lg mb-2">El enlace es inválido o ya expiró.</p>
      <p className="text-gray-600 mb-4">¿Querés que te enviemos otro?</p>
      { resendStatus === 'sent' ? (
        <p className="text-green-600">¡Email reenviado! Revisá tu bandeja.</p>
      ) : (
        <button
          onClick={ handleResend }
          disabled={ resendStatus === 'sending' }
          className="btn-primary"
        >
          { resendStatus === 'sending' ? 'Enviando...' : 'Reenviar email de verificación' }
        </button>
      ) }
      { resendStatus === 'error' && (
        <p className="text-red-500 text-sm mt-2">
          No se pudo reenviar. Iniciá sesión e intentá de nuevo.
        </p>
      ) }
    </div>
  );
};
