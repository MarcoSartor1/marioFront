export const revalidate = 60;

import Link from 'next/link';
import { IoSadOutline } from 'react-icons/io5';

import { getProductsByCategory } from '@/actions';
import { Pagination, ProductGrid, Title } from '@/components';

interface Props {
  params: {
    category: string;
  };
  searchParams: {
    page?: string;
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = params;
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const categoryLabel = category.charAt(0).toUpperCase() + category.slice(1);

  const { products, totalPages } = await getProductsByCategory({
    page,
    category,
  });

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <IoSadOutline className="w-16 h-16 text-gray-300" />
        <Title
          title={categoryLabel}
          subtitle="Esta categoría no tiene productos por el momento"
          className="text-center"
        />
        <Link
          href="/"
          className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
        >
          Ver todos los productos
        </Link>
      </div>
    );
  }

  return (
    <>
      <Title
        title={categoryLabel}
        subtitle="Todos los productos"
        className="mb-2"
      />

      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </>
  );
}
