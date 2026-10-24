'use client';

import AppShell from '@/components/AppShell';
import RoleGuard from '@/components/RoleGuard';

// Every signed-in page lives inside this layout: login check + sidebar + top bar
export default function AppLayout({ children }) {
  return (
    <RoleGuard>
      <AppShell>{children}</AppShell>
    </RoleGuard>
  );
}
