import Link from 'next/link';
import { Title } from '@/components';
import { getPackagingBoxes } from '@/actions/packaging/boxes';
import { PackagingManager } from './ui/PackagingManager';

export const dynamic = 'force-dynamic';

export default async function AdminPackagingPage() {
  const result = await getPackagingBoxes();
  return (
    <>
      <Link href="/admin/products" className="text-sm text-primary hover:underline">← Volver a productos</Link>
      <Title title="Cajas y embalajes" subtitle="Guardá tus cajas habituales una sola vez para reutilizarlas en tus envíos." />
      {result.ok ? (
        <PackagingManager initialBoxes={result.boxes} />
      ) : (
        <div role="alert" className="rounded-xl border border-red-200 bg-white p-6">
          <p className="text-red-700">{result.message}</p>
          <Link href="/admin/packaging" className="mt-4 inline-block text-primary underline">Volver a intentar</Link>
        </div>
      )}
    </>
  );
}
