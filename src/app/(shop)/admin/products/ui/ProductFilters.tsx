'use client';

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';

export function ProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlSearch = searchParams.get('search') ?? '';
  const sortByStock = searchParams.get('sortByStock') ?? '';
  const status = searchParams.get('status') ?? 'all';

  const [searchInput, setSearchInput] = useState(urlSearch);

  useEffect(() => {
    setSearchInput(urlSearch);
  }, [urlSearch]);

  const updateFilter = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete('page');
      for (const [key, value] of Object.entries(updates)) {
        if (value === null || value === '') {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams],
  );

  return (
    <div className="flex flex-wrap gap-3 mb-5 items-end bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="flex-1 min-w-[220px]">
        <label className="block text-xs font-medium text-gray-600 mb-1">Buscar producto</label>
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') updateFilter({ search: searchInput || null });
          }}
          onBlur={() => {
            if (searchInput !== urlSearch) updateFilter({ search: searchInput || null });
          }}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Stock</label>
        <select
          value={sortByStock}
          onChange={(e) => updateFilter({ sortByStock: e.target.value || null })}
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="">Sin ordenar</option>
          <option value="desc">Mayor a menor</option>
          <option value="asc">Menor a mayor</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Estado</label>
        <select
          value={status}
          onChange={(e) =>
            updateFilter({ status: e.target.value === 'all' ? null : e.target.value })
          }
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        >
          <option value="all">Todos</option>
          <option value="published">Publicados</option>
          <option value="draft">Borradores</option>
        </select>
      </div>

      {(urlSearch || sortByStock || status !== 'all') && (
        <button
          onClick={() => updateFilter({ search: null, sortByStock: null, status: null })}
          className="text-sm text-gray-500 hover:text-gray-800 underline self-end pb-2"
        >
          Limpiar filtros
        </button>
      )}
    </div>
  );
}
