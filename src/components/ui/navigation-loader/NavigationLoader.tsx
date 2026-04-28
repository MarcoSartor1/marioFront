'use client';

import { useEffect, Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useNavigationStore } from '@/store/navigation/navigation-store';

function NavigationLoaderInner() {
  const isLoading = useNavigationStore((s) => s.isLoading);
  const startLoading = useNavigationStore((s) => s.startLoading);
  const stopLoading = useNavigationStore((s) => s.stopLoading);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    stopLoading();
  }, [pathname, searchParams, stopLoading]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as Element).closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      if (
        href.startsWith('#') ||
        href.startsWith('http') ||
        href.startsWith('mailto:') ||
        anchor.target === '_blank' ||
        e.metaKey || e.ctrlKey || e.shiftKey || e.altKey
      ) return;

      startLoading();
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [startLoading]);

  if (!isLoading) return null;

  return (
    <div className="nav-loader-overlay">
      <div className="nav-loader-backdrop" />
      <div className="nav-loader-shimmer" />
      <div className="nav-loader-content">
        <div className="nav-loader-spinner" />
        <span className="nav-loader-text">Cargando...</span>
      </div>
    </div>
  );
}

export const NavigationLoader = () => (
  <Suspense>
    <NavigationLoaderInner />
  </Suspense>
);
