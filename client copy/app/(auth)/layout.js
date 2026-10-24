'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function AuthLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 55%, #0f766e 140%)',
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 440 }}>
        <Box sx={{ textAlign: 'center', mb: 3, color: '#fff' }}>
          <Box
            sx={{
              width: 52,
              height: 52,
              mx: 'auto',
              mb: 1.5,
              borderRadius: 3,
              bgcolor: 'primary.main',
              display: 'grid',
              placeItems: 'center',
              fontSize: 26,
              fontWeight: 800,
            }}
          >
            H
          </Box>
          <Typography variant="h5" sx={{ color: '#fff' }}>
            HCM Lite
          </Typography>
          <Typography variant="body2" sx={{ color: '#94a3b8' }}>
            AI-assisted Human Capital Management
          </Typography>
        </Box>
        {children}
      </Box>
    </Box>
  );
}
