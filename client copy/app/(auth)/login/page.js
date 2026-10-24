'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '@/features/auth/AuthContext';
import { getSetupStatus } from '@/features/auth/api';
import { errorMessage } from '@/lib/apiClient';
import { ROLE_HOME } from '@/lib/roles';

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Already signed in? Go straight to your dashboard.
  useEffect(() => {
    if (!loading && user) {
      router.replace(user.mustChangePassword ? '/change-password' : ROLE_HOME[user.role]);
    }
  }, [loading, user, router]);

  // Brand new install? Send the visitor to first-run setup.
  useEffect(() => {
    let cancelled = false;
    getSetupStatus()
      .then((status) => {
        if (!cancelled && status.needsSetup) router.replace('/setup');
      })
      .catch(() => {
        // If the server is offline, the login attempt will show a clear error.
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Enter your email and password.');
      return;
    }
    setSubmitting(true);
    try {
      const me = await login(email, password);
      router.replace(me.mustChangePassword ? '/change-password' : ROLE_HOME[me.role]);
    } catch (err) {
      setError(errorMessage(err));
      setSubmitting(false);
    }
  }

  return (
    <Card sx={{ p: { xs: 2.5, sm: 4 } }}>
      <Typography variant="h6" sx={{ mb: 0.5 }}>
        Sign in
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Use the email and password given to you by your company.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            autoFocus
            required
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowPassword((s) => !s)} edge="end" aria-label="show or hide password">
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Button type="submit" variant="contained" size="large" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign in'}
          </Button>
        </Stack>
      </Box>
    </Card>
  );
}
