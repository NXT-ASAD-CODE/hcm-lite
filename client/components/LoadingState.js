'use client';

import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';

export default function LoadingState({ fullScreen = false, label = 'Loading…' }) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1.5,
        minHeight: fullScreen ? '100vh' : 200,
        color: 'text.secondary',
      }}
    >
      <CircularProgress size={32} />
      <Typography variant="body2">{label}</Typography>
    </Box>
  );
}
