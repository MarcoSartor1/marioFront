'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { createUpdateCategory, deleteCategory } from '@/actions';

interface FormInputs {
  name: string;
}

interface Category {
  id: string;
  name: string;
}

interface Props {
  category: Category | null;
}

export const CategoryForm = ({ category }: Props) => {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: { name: category?.name ?? '' },
  });

  const onSubmit = async (data: FormInputs) => {
    setSaving(true);
    const result = await createUpdateCategory(category?.id ?? null, data.name);
    setSaving(false);
    if (!result.ok) {
      alert(result.message);
      return;
    }
    router.push('/admin/categories');
  };

  const onDelete = async () => {
    if (!category) return;
    if (!confirm(`¿Eliminar la categoría "${category.name}"?`)) return;
    setDeleting(true);
    const result = await deleteCategory(category.id);
    setDeleting(false);
    if (!result.ok) {
      alert(result.message);
      return;
    }
    router.push('/admin/categories');
  };

  const busy = saving || deleting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md">
      <div className="mb-5">
        <label className="text-sm text-gray-700 font-bold mb-1 block">
          Nombre
        </label>
        <input
          type="text"
          className="p-2 border rounded-md bg-gray-100 w-full"
          {...register('name', { required: 'El nombre es requerido' })}
        />
        {errors.name && (
          <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
        )}
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={busy} className="btn-primary flex-1 disabled:opacity-60">
          {saving ? 'Guardando...' : category ? 'Actualizar' : 'Crear categoría'}
        </button>

        {category && (
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            className="btn-danger flex-1 disabled:opacity-60"
          >
            {deleting ? 'Eliminando...' : 'Eliminar'}
          </button>
        )}
      </div>
    </form>
  );
};
