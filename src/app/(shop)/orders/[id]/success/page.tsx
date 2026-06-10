'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getOrderById, verifyPayment } from '@/actions';

const MAX_RETRIES = 10;
const POLL_INTERVAL_MS = 3000;

export default function OrderSuccessPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isPaid, setIsPaid] = useState<boolean | null>(null);
  const [isPolling, setIsPolling] = useState(true);
  const retries = useRef(0);

  const startPolling = () => {
    const check = async () => {
      const { ok, order } = await getOrderById(id);

      if (!ok) {
        router.replace('/');
        return;
      }

      if (order?.isPaid) {
        setIsPaid(true);
        setIsPolling(false);
        return;
      }

      retries.current += 1;

      if (retries.current >= MAX_RETRIES) {
        setIsPaid(false);
        setIsPolling(false);
        return;
      }

      setTimeout(check, POLL_INTERVAL_MS);
    };

    check();
  };

  useEffect(() => {
    const paymentId = searchParams.get('payment_id');

    if (!paymentId) {
      startPolling();
      return;
    }

    verifyPayment(paymentId).then((result) => {
      if (result.ok && result.isPaid) {
        setIsPaid(true);
        setIsPolling(false);
        return;
      }

      if (
        result.ok &&
        !result.isPaid &&
        (result.status === 'in_process' || result.status === 'pending')
      ) {
        startPolling();
        return;
      }

      // fallback: cualquier otro resultado (error, rejected, etc.) → polling
      startPolling();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  if (isPolling) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent" />
        <p className="text-lg text-gray-600">Verificando tu pago...</p>
      </div>
    );
  }

  if (isPaid) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
        <div className="text-green-500 text-6xl">✓</div>
        <h1 className="text-3xl font-bold text-gray-800">¡Pago aprobado!</h1>
        <p className="text-gray-600 max-w-md">
          Tu pago fue procesado correctamente. Gracias por tu compra.
        </p>
        <div className="flex gap-4 flex-wrap justify-center">
          <Link
            href={`/orders/${id}`}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Ver orden
          </Link>
          <Link
            href="/"
            className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-6 rounded-lg transition-colors"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <div className="text-yellow-500 text-6xl">⏳</div>
      <h1 className="text-3xl font-bold text-gray-800">Pago en proceso</h1>
      <p className="text-gray-600 max-w-md">
        Tu pago está siendo procesado. Puede tardar unos minutos en confirmarse.
        Revisá el estado de tu orden en breve.
      </p>
      <Link
        href={`/orders/${id}`}
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
      >
        Ver estado de la orden
      </Link>
    </div>
  );
}
