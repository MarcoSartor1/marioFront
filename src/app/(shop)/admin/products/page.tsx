export const revalidate = 0;

import { Suspense } from 'react';
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
