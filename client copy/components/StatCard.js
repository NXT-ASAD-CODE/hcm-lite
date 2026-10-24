'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';

// A responsive row of stat cards. columns = how many per row on wide screens.
export function StatGrid({ children, columns = 4 }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        mb: 3,
        gridTemplateColumns: {
          xs: '1fr',
          sm: 'repeat(2, 1fr)',
          lg: `repeat(${columns}, 1fr)`,
        },
      }}
    >
      {children}
    </Box>
  );
}

// value = null means "no data yet" and shows a dash. We never show fake numbers.
export default function StatCard({ label, value, hint, icon, color = 'primary.main' }) {
  const empty = value === null || value === undefined;
  return (
    <Card>
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 2 }}>
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
            {label}
          </Typography>
          <Typography variant="h4" sx={{ mt: 0.5, color: empty ? 'text.disabled' : 'text.primary' }}>
            {empty ? '—' : value}
          </Typography>
          {hint && (
            <Typography variant="caption" color="text.secondary">
              {hint}
            </Typography>
          )}
        </Box>
        {icon && (
          <Box
            sx={{
              width: 44,
              height: 44,
              flexShrink: 0,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              color: '#fff',
              bgcolor: color,
              opacity: 0.92,
            }}
          >
            {icon}
          </Box>
        )}
      </Box>
    </Card>
  );
}
