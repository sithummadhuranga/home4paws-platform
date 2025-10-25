// This file helps disable SSR for development speed
// Import this in pages where you want to disable SSR

'use client';

import dynamic from 'next/dynamic';
import { ComponentType } from 'react';

/**
 * Wrapper to disable SSR for any component during development
 * Usage: const MyPage = withNoSSR(() => import('./MyPageComponent'))
 */
export function withNoSSR<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>
) {
  return dynamic(importFn, {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    ),
  });
}

/**
 * Hook to disable SSR on the client side
 * Add this to the top of any page component
 */
export function useClientOnly(callback?: () => void) {
  if (typeof window !== 'undefined' && callback) {
    callback();
  }
  return typeof window !== 'undefined';
}
