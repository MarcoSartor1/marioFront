import { Suspense } from 'react';
import { redirect } from 'next/navigation';

import { getPaginatedProductsWithImages, syncXubioProducts } from '@/actions';
import { Pagination, ProductGrid, Title } from '@/components';
import { HomeSearchInput } from './ui/HomeSearchInput';

interface Props {
  searchParams: {
    page?: string;
    q?: string;
  }
}

export default async function Home({ searchParams }: Props) {

  const page = searchParams.page ? parseInt(searchParams.page) : 1;
  const query = searchParams.q?.trim() ?? '';

  await syncXubioProducts().catch(() => null);

  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
    ...(query ? { search: query } : {}),
  });

  if (products.length === 0 && !query) {
    redirect('/empty');
  }

  return (
    <>
      <Title
        title="Tienda"
        subtitle="Todos los productos"
        className="mb-2"
      />

      <Suspense>
        <HomeSearchInput />
      </Suspense>

      {products.length === 0 && query ? (
        <p className="text-gray-500 mt-4 text-center">
          No se encontraron productos para &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <>
          <ProductGrid products={products} />
          <Pagination totalPages={totalPages} />
        </>
      )}
    </>
  );
}
