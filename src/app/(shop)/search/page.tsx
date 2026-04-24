export const revalidate = 0;

import { Suspense } from "react";
import { getPaginatedProductsWithImages } from "@/actions";
import { Pagination, ProductGrid } from "@/components";
import { SearchInput } from "./ui/SearchInput";

interface Props {
  searchParams: { q?: string; page?: string };
}

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q?.trim() ?? "";
  const page = searchParams.page ? parseInt(searchParams.page) : 1;

  const { products, totalPages } = query
    ? await getPaginatedProductsWithImages({ page, search: query })
    : { products: [], totalPages: 0 };

  return (
    <div className="px-5 max-w-screen-xl mx-auto mt-8">
      <h1 className="text-2xl font-semibold mb-6">Buscar productos</h1>

      <Suspense>
        <SearchInput initialQuery={query} />
      </Suspense>

      {query && products.length === 0 && (
        <p className="text-gray-500 mt-4">
          No se encontraron productos para &ldquo;{query}&rdquo;.
        </p>
      )}

      {products.length > 0 && (
        <>
          <p className="text-sm text-gray-500 mb-4">
            Resultados para &ldquo;{query}&rdquo;
          </p>
          <ProductGrid products={products} />
          <Suspense>
            <Pagination totalPages={totalPages} />
          </Suspense>
        </>
      )}

      {!query && (
        <p className="text-gray-400 mt-2">
          Ingresá un término para buscar.
        </p>
      )}
    </div>
  );
}
