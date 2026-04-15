'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { AdminProduct } from '@/interfaces';
import { toggleProductPublish, syncXubioProducts } from '@/actions';
import { ProductImage } from '@/components';
import { currencyFormat } from '@/utils';

interface Props {
  products: AdminProduct[];
  isAdmin: boolean;
}

interface Toast {
  type: 'success' | 'error';
  message: string;
}

export function AdminProductsTable({ products, isAdmin }: Props) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isPending, startTransition] = useTransition();
  const [isSyncing, setIsSyncing] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (t: Toast) => {
    setToast(t);
    setTimeout(() => setToast(null), 5000);
  };

  const toggleAll = (checked: boolean) => {
    setSelectedIds(checked ? new Set(products.map((p) => p.id)) : new Set());
  };

  const toggleOne = (id: string, checked: boolean) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      checked ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const handlePublish = (publish: boolean) => {
    startTransition(async () => {
      await toggleProductPublish(Array.from(selectedIds), publish);
      setSelectedIds(new Set());
      router.refresh();
    });
  };

  const handleSyncXubio = async () => {
    setIsSyncing(true);
    const result = await syncXubioProducts();
    setIsSyncing(false);

    if (result.ok) {
      showToast({
        type: 'success',
        message: `Sincronización completa: ${result.data.created} productos nuevos importados de ${result.data.total} totales`,
      });
      router.refresh();
    } else {
      showToast({ type: 'error', message: result.message });
    }
  };

  const hasSelection = selectedIds.size > 0;

  return (
    <>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 max-w-sm px-4 py-3 rounded shadow-lg text-white text-sm transition-all ${
            toast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex justify-end gap-3 mb-5 flex-wrap">
        <button
          onClick={() => handlePublish(false)}
          disabled={!hasSelection || isPending}
          className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Despublicar seleccionados
        </button>
        <button
          onClick={() => handlePublish(true)}
          disabled={!hasSelection || isPending}
          className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Publicar seleccionados
        </button>
        {isAdmin && (
          <button
            onClick={handleSyncXubio}
            disabled={isSyncing}
            className="btn-secondary disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSyncing ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z" />
                </svg>
                Sincronizando...
              </>
            ) : (
              'Sincronizar con Xubio'
            )}
          </button>
        )}
        <Link href="/admin/products/bulk-upload" className="btn-secondary">
          Carga masiva
        </Link>
        <Link href="/admin/product/new" className="btn-primary">
          Nuevo producto
        </Link>
      </div>

      <table className="min-w-full">
        <thead className="bg-gray-200 border-b">
          <tr>
            <th className="px-4 py-4">
              <input
                type="checkbox"
                checked={products.length > 0 && selectedIds.size === products.length}
                onChange={(e) => toggleAll(e.target.checked)}
                className="w-4 h-4 cursor-pointer"
              />
            </th>
            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Imagen</th>
            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Título</th>
            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Precio</th>
            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Género</th>
            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Inventario</th>
            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Tallas</th>
            <th className="text-sm font-medium text-gray-900 px-6 py-4 text-left">Estado</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr
              key={product.id}
              className="bg-white border-b transition duration-300 ease-in-out hover:bg-gray-100"
            >
              <td className="px-4 py-4 text-center">
                <input
                  type="checkbox"
                  checked={selectedIds.has(product.id)}
                  onChange={(e) => toggleOne(product.id, e.target.checked)}
                  className="w-4 h-4 cursor-pointer"
                />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                <Link href={`/product/${product.slug}`}>
                  <ProductImage
                    src={product.images?.[0]}
                    width={80}
                    height={80}
                    alt={product.title}
                    className="w-20 h-20 object-cover rounded"
                  />
                </Link>
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                <Link href={`/admin/product/${product.slug}`} className="hover:underline">
                  {product.title}
                </Link>
              </td>
              <td className="text-sm font-bold text-gray-900 px-6 py-4 whitespace-nowrap">
                {currencyFormat(product.price)}
              </td>
              <td className="text-sm text-gray-900 font-light px-6 py-4 whitespace-nowrap">
                {product.gender}
              </td>
              <td className="text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                {product.stock}
              </td>
              <td className="text-sm text-gray-900 font-bold px-6 py-4 whitespace-nowrap">
                {product.sizes.join(', ')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {product.isPublished ? (
                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    Publicado
                  </span>
                ) : (
                  <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
                    Borrador
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
