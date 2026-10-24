'use client';

import { Suspense } from 'react';
import AppShell from '@/components/AppShell';
import LoadingState from '@/components/LoadingState';
import RoleGuard from '@/components/RoleGuard';

// Every signed-in page lives inside this layout: login check + sidebar + top bar
export default function AppLayout({ children }) {
  return (
    <Suspense fallback={<LoadingState fullScreen />}>
      <RoleGuard>
        <AppShell>{children}</AppShell>
      </RoleGuard>
    </Suspense>
  );
}