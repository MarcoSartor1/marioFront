import { Title } from '@/components';
import { redirect } from 'next/navigation';
import { CategoryForm } from './ui/CategoryForm';

interface Props {
  params: { id: string };
}

async function getCategoryById(id: string): Promise<{ id: string; name: string } | null> {
  try {
    const resp = await fetch(`${process.env.API_URL}/categories/${id}`, {
      cache: 'no-store',
    });
    if (!resp.ok) return null;
    return resp.json();
  } catch {
    return null;
  }
}

export default async function CategoryPage({ params }: Props) {
  const { id } = params;

  const category = id === 'new' ? null : await getCategoryById(id);

  if (id !== 'new' && !category) {
    redirect('/admin/categories');
  }

  return (
    <>
      <Title title={category ? 'Editar categoría' : 'Nueva categoría'} />
      <CategoryForm category={category} />
    </>
  );
}
