'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

export default function EmptyState({ icon, title, description, action }) {
  return (
    <Box sx={{ textAlign: 'center', py: 4, px: 2 }}>
      {icon && (
        <Box
          sx={{
            width: 52,
            height: 52,
            mx: 'auto',
            mb: 1.5,
            borderRadius: '50%',
            display: 'grid',
            placeItems: 'center',
            bgcolor: '#f1f5f9',
            color: 'text.secondary',
          }}
        >
          {icon}
        </Box>
      )}
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 420, mx: 'auto' }}>
          {description}
        </Typography>
      )}
      {action && <Box sx={{ mt: 2 }}>{action}</Box>}
    </Box>
  );
}
