export const revalidate = 0;

import { getPaginatedOrders } from '@/actions';
import { Title } from '@/components';
import { redirect } from 'next/navigation';
import { OrdersTable } from './ui/OrdersTable';

export default async function OrdersPage() {
  const { ok, orders = [] } = await getPaginatedOrders();

  if (!ok) {
    redirect('/auth/login');
  }

  return (
    <>
      <Title title="Todas las órdenes" />
      <div className="mb-10 overflow-x-auto">
        <OrdersTable orders={orders} />
      </div>
    </>
  );
}
