'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import LoadingState from '@/components/LoadingState';
import { useAuth } from '@/features/auth/AuthContext';
import { getSetupStatus } from '@/features/auth/api';
import { errorMessage } from '@/lib/apiClient';
import { ROLE_HOME } from '@/lib/roles';

// The front door: sends each visitor to the right place.
export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [error, setError] = useState('');
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (loading) return undefined;

    if (user) {
      router.replace(user.mustChangePassword ? '/change-password' : ROLE_HOME[user.role]);
      return undefined;
    }

    let cancelled = false;
    getSetupStatus()
      .then((status) => {
        if (!cancelled) router.replace(status.needsSetup ? '/setup' : '/login');
      })
      .catch((err) => {
        if (!cancelled) setError(errorMessage(err));
      });
    return () => {
      cancelled = true;
    };
  }, [loading, user, router, attempt]);

  if (error) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2 }}>
        <Box sx={{ maxWidth: 440 }}>
          <Alert
            severity="error"
            action={
              <Button
                color="inherit"
                size="small"
                onClick={() => {
                  setError('');
                  setAttempt((n) => n + 1);
                }}
              >
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        </Box>
      </Box>
    );
  }

  return <LoadingState fullScreen />;
}
