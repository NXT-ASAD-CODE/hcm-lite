'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/features/auth/AuthContext';
import { ROLE_HOME } from '@/lib/roles';
import LoadingState from './LoadingState';

// Keeps people on the right pages. The real security check is on the server;
// this only makes the screens behave sensibly.
export default function RoleGuard({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const area = pathname.split('/')[1];
  const wrongArea = Boolean(user) && ['admin', 'hr', 'employee'].includes(area) && area !== user.role;

  let redirectTo = null;
  if (!user) redirectTo = '/login';
  else if (user.mustChangePassword) redirectTo = '/change-password';
  else if (wrongArea) redirectTo = ROLE_HOME[user.role];

  useEffect(() => {
    if (!loading && redirectTo) router.replace(redirectTo);
  }, [loading, redirectTo, router]);

  if (loading || redirectTo) return <LoadingState fullScreen />;
  return children;
}
