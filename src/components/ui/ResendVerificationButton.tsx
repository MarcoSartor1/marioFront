'use client';

import { useState } from 'react';
import { resendVerification } from '@/actions';

export const ResendVerificationButton = () => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleResend = async () => {
    setStatus('sending');
    const resp = await resendVerification();
    setStatus(resp.ok ? 'sent' : 'error');
  };

  if ( status === 'sent' ) {
    return <span className="font-medium">¡Email enviado! Revisá tu bandeja.</span>;
  }

  if ( status === 'error' ) {
    return <span className="font-medium text-yellow-900">No se pudo enviar. Intentá más tarde.</span>;
  }

  return (
    <button
      onClick={ handleResend }
      disabled={ status === 'sending' }
      className="underline font-medium hover:no-underline disabled:opacity-60"
    >
      { status === 'sending' ? 'Enviando...' : 'Reenviar email' }
    </button>
  );
};
