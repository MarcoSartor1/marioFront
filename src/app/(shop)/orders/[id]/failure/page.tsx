import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getOrderById } from '@/actions';

interface Props {
  params: { id: string };
}

export default async function OrderFailurePage({ params }: Props) {
  const { id } = params;
  const { ok } = await getOrderById(id);

  if (!ok) redirect('/');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <div className="text-red-500 text-6xl">✕</div>
      <h1 className="text-3xl font-bold text-gray-800">Pago rechazado</h1>
      <p className="text-gray-600 max-w-md">
        Tu pago no pudo completarse. Podés intentarlo nuevamente o elegir otro
        método de pago.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          href={`/orders/${id}`}
          className="bg-[#009ee3] hover:bg-[#007eb5] text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Reintentar pago
        </Link>
        <Link
          href="/orders"
          className="border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Mis órdenes
        </Link>
      </div>
    </div>
  );
}
