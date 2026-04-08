import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getOrderById } from '@/actions';

interface Props {
  params: { id: string };
}

export default async function OrderPendingPage({ params }: Props) {
  const { id } = params;
  const { ok } = await getOrderById(id);

  if (!ok) redirect('/');

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
      <div className="text-yellow-500 text-6xl">⏳</div>
      <h1 className="text-3xl font-bold text-gray-800">Pago pendiente</h1>
      <p className="text-gray-600 max-w-md">
        Tu pago está pendiente de acreditación. MercadoPago te notificará cuando
        se confirme. Podés revisar el estado de tu orden en cualquier momento.
      </p>
      <div className="flex gap-4 flex-wrap justify-center">
        <Link
          href={`/orders/${id}`}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
        >
          Ver estado de la orden
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
