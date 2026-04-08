'use client';

import { useState } from 'react';
import { createMpPreference } from '@/actions';

interface Props {
  orderId: string;
}

export const MercadoPagoButton = ({ orderId }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePay = async () => {
    setIsLoading(true);
    setError('');

    const result = await createMpPreference(orderId);

    if (!result.ok) {
      setError(result.message ?? 'Error al iniciar el pago');
      setIsLoading(false);
      return;
    }

    const url =
      process.env.NODE_ENV === 'production'
        ? result.initPoint
        : result.sandboxInitPoint;

    window.location.href = url;
  };

  return (
    <div>
      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
      <button
        onClick={handlePay}
        disabled={isLoading}
        className="flex items-center justify-center gap-2 bg-[#009ee3] hover:bg-[#007eb5] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg w-full transition-colors"
      >
        {isLoading ? 'Redirigiendo a MercadoPago...' : 'Pagar con MercadoPago'}
      </button>
    </div>
  );
};
