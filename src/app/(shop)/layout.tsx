import { Footer, Sidebar, TopMenuWrapper } from '@/components';
import { getStoreConfig } from '@/actions/config/get-store-config';
import { getCategories } from '@/actions';
import { EmailVerificationBanner } from '@/components/ui/EmailVerificationBanner';

export default async function ShopLayout({ children }: {
  children: React.ReactNode;
}) {
  const { config } = await getStoreConfig();
  const isContactPagePublished = config?.isContactPagePublished ?? false;
  const categories = await getCategories();

  return (
    <main className="min-h-screen">

      <TopMenuWrapper />
      <Sidebar isContactPagePublished={isContactPagePublished} categories={categories} />
      <EmailVerificationBanner />

      <div className="px-4 sm:px-10">
        {children}
      </div>

      <Footer />
    </main>
  );
}
