import { getCategories } from '@/actions';
import { getStoreConfig } from '@/actions/config/get-store-config';
import { TopMenu } from './TopMenu';

export async function TopMenuWrapper() {
  const [result, categories] = await Promise.all([
    getStoreConfig(),
    getCategories(),
  ]);

  const storeName = result.config?.name || 'Teslo | Shop';
  const logoUrl = result.config?.logoUrl || null;

  return <TopMenu storeName={storeName} logoUrl={logoUrl} categories={categories} />;
}
