import { Footer, Sidebar, TopMenuWrapper } from '@/components';
import { getStoreConfig } from '@/actions/config/get-store-config';

export default async function ShopLayout({ children }: {
  children: React.ReactNode;
}) {
  const { config } = await getStoreConfig();
  const isContactPagePublished = config?.isContactPagePublished ?? false;

  return (
    <main className="min-h-screen">

      <TopMenuWrapper />
      <Sidebar isContactPagePublished={isContactPagePublished} />

      <div className="px-4 sm:px-10">
        {children}
      </div>

      <Footer />
    </main>
  );
}
