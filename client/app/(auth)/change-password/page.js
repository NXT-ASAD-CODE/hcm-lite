'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useAuth } from '@/features/auth/AuthContext';
import { changePassword } from '@/features/auth/api';
import { errorMessage } from '@/lib/apiClient';
import { ROLE_HOME } from '@/lib/roles';

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user, loading, refresh } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [loading, user, router]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.newPassword.length < 8) {
      setError('The new password must be at least 8 characters.');
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError('The two new passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      await changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      const me = await refresh();
      router.replace(me ? ROLE_HOME[me.role] : '/login');
    } catch (err) {
      setError(errorMessage(err));
      setSubmitting(false);
    }
  }

  if (loading || !user) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', py: 6 }}>
        <CircularProgress sx={{ color: '#fff' }} />
      </Box>
    );
  }

  return (
    <Card sx={{ p: { xs: 2.5, sm: 4 } }}>
      <Typography variant="h6" sx={{ mb: 0.5 }}>
        Change password
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {user.mustChangePassword
          ? 'You are using a temporary password. Choose a new one to continue.'
          : 'Choose a new password for your account.'}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={2}>
          <TextField
            label={user.mustChangePassword ? 'Temporary password' : 'Current password'}
            type="password"
            value={form.currentPassword}
            onChange={update('currentPassword')}
            autoComplete="current-password"
            autoFocus
            required
          />
          <TextField
            label="New password"
            type="password"
            value={form.newPassword}
            onChange={update('newPassword')}
            autoComplete="new-password"
            helperText="At least 8 characters"
            required
          />
          <TextField
            label="Confirm new password"
            type="password"
            value={form.confirmPassword}
            onChange={update('confirmPassword')}
            autoComplete="new-password"
            required
          />
          <Button type="submit" variant="contained" size="large" disabled={submitting}>
            {submitting ? 'Saving…' : 'Change password'}
          </Button>
          {!user.mustChangePassword && (
            <Button onClick={() => router.push(ROLE_HOME[user.role])} color="inherit">
              Cancel
            </Button>
          )}
        </Stack>
      </Box>
    </Card>
  );
}
