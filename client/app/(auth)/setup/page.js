'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '@/features/auth/AuthContext';
import { createSetup, getSetupStatus } from '@/features/auth/api';
import { errorMessage } from '@/lib/apiClient';
import { ROLE_HOME } from '@/lib/roles';

export default function SetupPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [checking, setChecking] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    companyName: '',
    adminName: '',
    adminEmail: '',
    adminPassword: '',
    confirmPassword: '',
  });

  // If the company is already set up, go to the login page instead
  useEffect(() => {
    let cancelled = false;
    getSetupStatus()
      .then((status) => {
        if (cancelled) return;
        if (!status.needsSetup) router.replace('/login');
        else setChecking(false);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(errorMessage(err));
        setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (form.adminPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (form.adminPassword !== form.confirmPassword) {
      setError('The two passwords do not match.');
      return;
    }

    setSubmitting(true);
    try {
      await createSetup({
        companyName: form.companyName,
        adminName: form.adminName,
        adminEmail: form.adminEmail,
        adminPassword: form.adminPassword,
      });
      const me = await login(form.adminEmail, form.adminPassword);
      router.replace(ROLE_HOME[me.role]);
    } catch (err) {
      setError(errorMessage(err));
      setSubmitting(false);
    }
  }

  if (checking) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
        <CircularProgress sx={{ color: '#fff' }} />
      </Box>
    );
  }

  return (
    <Card sx={{ p: { xs: 2.5, sm: 4 } }}>
      <Typography variant="h6" sx={{ mb: 0.5 }}>
        Set up your company
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        This is the first run. Create the company and the Admin account. You can add everything else after you sign in.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          <TextField label="Company name" value={form.companyName} onChange={update('companyName')} required autoFocus />
          <TextField label="Admin full name" value={form.adminName} onChange={update('adminName')} required autoComplete="name" />
          <TextField
            label="Admin email"
            type="email"
            value={form.adminEmail}
            onChange={update('adminEmail')}
            required
            autoComplete="email"
          />
          <TextField
            label="Password"
            type={showPassword ? 'text' : 'password'}
            value={form.adminPassword}
            onChange={update('adminPassword')}
            required
            autoComplete="new-password"
            helperText="At least 8 characters"
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword((s) => !s)} edge="end" aria-label="show or hide password">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            label="Confirm password"
            type={showPassword ? 'text' : 'password'}
            value={form.confirmPassword}
            onChange={update('confirmPassword')}
            required
            autoComplete="new-password"
          />
          <Button type="submit" variant="contained" size="large" disabled={submitting}>
            {submitting ? 'Creating…' : 'Create company and Admin'}
          </Button>
        </Stack>
      </Box>
    </Card>
  );
}
