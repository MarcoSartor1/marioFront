'use client';

import { useRouter } from 'next/navigation';
import { useNavigationStore } from '@/store/navigation/navigation-store';

export const useNavigation = () => {
  const router = useRouter();
  const startLoading = useNavigationStore((s) => s.startLoading);

  const push = (href: string) => {
    startLoading();
    router.push(href);
  };

  return { push };
};
