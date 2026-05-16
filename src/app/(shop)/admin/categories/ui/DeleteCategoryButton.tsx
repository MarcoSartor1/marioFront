'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteCategory } from '@/actions';

interface Props {
  id: string;
  name: string;
}

export const DeleteCategoryButton = ({ id, name }: Props) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar la categoría "${name}"?`)) return;
    setLoading(true);
    const result = await deleteCategory(id);
    setLoading(false);
    if (!result.ok) {
      alert(result.message ?? 'No se pudo eliminar la categoría');
      return;
    }
    router.refresh();
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-red-600 hover:underline ml-4 disabled:opacity-50"
    >
      {loading ? 'Eliminando...' : 'Eliminar'}
    </button>
  );
};
