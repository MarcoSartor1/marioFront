export const revalidate = 0;

import { getAdminProducts } from '@/actions';
import { Pagination, Title } from '@/components';
import { auth } from '@/auth.config';
import { redirect } from 'next/navigation';
import { AdminProductsTable } from './ui/AdminProductsTable';

interface Props {
  searchParams: {
    page?: string;
  };
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const [{ products, totalPages }, session] = await Promise.all([
    getAdminProducts({ page }),
    auth(),
  ]);

  if (products.length === 0 && page > 1) redirect('/admin/products');

  const isAdmin = session?.user?.role === 'admin';

  return (
    <>
      <Title title="Mantenimiento de productos" />

      <div className="mb-10">
        <AdminProductsTable products={products} isAdmin={isAdmin} />
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}
