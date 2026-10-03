import { getCategories, getProductBySlug } from '@/actions';
import { Title } from '@/components';
import { redirect } from 'next/navigation';
import { ProductForm } from './ui/ProductForm';
import { getPackagingBoxes } from '@/actions/packaging/boxes';

interface Props {
  params: {
    slug: string;
  }
}



export default async function ProductPage({ params }: Props) {

  const { slug } = params;
  const isNewProduct = slug === 'new';

  const [ product, categories, packaging ] = await Promise.all([
    isNewProduct ? Promise.resolve(null) : getProductBySlug(slug),
    getCategories(),
    getPackagingBoxes(),
  ]);
 

  if ( !product && !isNewProduct ) {
    redirect('/admin/products')
  }

  const title = isNewProduct ? 'Nuevo producto' : 'Editar producto'

  return (
    <>
      <Title title={ title } />

      <ProductForm product={ product ?? {} } categories={ categories } boxes={packaging.ok ? packaging.boxes : []} packagingError={packaging.ok ? undefined : packaging.message} />
    </>
  );
}
