'use client';

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
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputs>({
    defaultValues: { name: category?.name ?? '' },
  });

  const onSubmit = async (data: FormInputs) => {
    const result = await createUpdateCategory(category?.id ?? null, data.name);
    if (!result.ok) {
      alert(result.message);
      return;
    }
    router.push('/admin/categories');
  };

  const onDelete = async () => {
    if (!category) return;
    const confirmed = confirm(`¿Eliminar la categoría "${category.name}"?`);
    if (!confirmed) return;

    const result = await deleteCategory(category.id);
    if (!result.ok) {
      alert(result.message);
      return;
    }
    router.push('/admin/categories');
  };

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
        <button type="submit" className="btn-primary flex-1">
          {category ? 'Actualizar' : 'Crear categoría'}
        </button>

        {category && (
          <button
            type="button"
            onClick={onDelete}
            className="btn-danger flex-1"
          >
            Eliminar
          </button>
        )}
      </div>
    </form>
  );
};
