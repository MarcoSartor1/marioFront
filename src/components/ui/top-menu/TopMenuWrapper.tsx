import { getCategories } from '@/actions';
import { getStoreConfig } from '@/actions/config/get-store-config';
import { STORE_NAME } from '@/config/store';
import { TopMenu } from './TopMenu';

export async function TopMenuWrapper() {
  const [result, categories] = await Promise.all([
    getStoreConfig(),
    getCategories(),
  ]);

  const storeName = result.config?.name || STORE_NAME;
  const logoUrl = result.config?.logoUrl || null;
  const showTitleWithLogo = result.config?.showTitleWithLogo ?? false;
  const isContactPagePublished = result.config?.isContactPagePublished ?? false;

  return (
    <TopMenu
      storeName={storeName}
      logoUrl={logoUrl}
      showTitleWithLogo={showTitleWithLogo}
      categories={categories}
      isContactPagePublished={isContactPagePublished}
    />
  );
}
