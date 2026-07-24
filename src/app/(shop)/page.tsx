import { Suspense } from 'react';
import { redirect } from 'next/navigation';

import { getPaginatedProductsWithImages } from '@/actions';
import { Pagination, ProductGrid } from '@/components';
import { titleFont } from '@/config/fonts';
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

  const { products, totalPages } = await getPaginatedProductsWithImages({
    page,
    ...(query ? { search: query } : {}),
  });

  if (products.length === 0 && !query) {
    redirect('/empty');
  }

  return (
    <>
      {/* Hero banner */}
      <div className="relative mt-6 mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-50 via-orange-50 to-stone-100 border border-amber-100 px-6 py-10 text-center">
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'repeating-linear-gradient(45deg, #C4622D 0, #C4622D 1px, transparent 0, transparent 50%)', backgroundSize: '12px 12px' }}
        />
        <p className="relative text-xs uppercase tracking-[0.3em] text-primary font-semibold mb-3">
          Tienda Online
        </p>
        <h1 className={`${titleFont.className} relative text-4xl sm:text-5xl font-bold text-stone-800 mb-3`}>
          Todos los productos
        </h1>
        <p className="relative text-stone-500 text-base max-w-sm mx-auto">
          Artesanías y productos con identidad argentina
        </p>
      </div>

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
