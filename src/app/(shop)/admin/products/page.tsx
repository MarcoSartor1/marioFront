export const revalidate = 0;

import { Suspense } from 'react';
import Link from 'next/link';
import { getAdminProducts } from '@/actions';
import { Pagination, Title } from '@/components';
import { redirect } from 'next/navigation';
import { AdminProductsTable } from './ui/AdminProductsTable';
import { ProductFilters } from './ui/ProductFilters';

interface Props {
  searchParams: {
    page?: string;
    search?: string;
    sortByStock?: string;
    status?: string;
  };
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products, totalPages } = await getAdminProducts({
    page,
    search: searchParams.search,
    sortByStock: searchParams.sortByStock,
    status: searchParams.status,
  });

  if (products.length === 0 && page > 1) redirect('/admin/products');

  return (
    <>
      <Title title="Mantenimiento de productos" />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white p-4">
        <p className="text-sm text-gray-600">Configurá las cajas que usás para despachar tus productos.</p>
        <Link href="/admin/packaging" className="text-sm font-semibold text-primary hover:underline">Cajas y embalajes →</Link>
      </div>

      <div className="mb-10">
        <Suspense>
          <ProductFilters />
        </Suspense>
        <AdminProductsTable products={products} />
        <Pagination totalPages={totalPages} />
      </div>
    </>
  );
}
