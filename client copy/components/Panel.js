'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

// A white card with a title, used for charts, lists and forms
export default function Panel({ title, subtitle, action, children, sx }) {
  return (
    <Card sx={sx}>
      {(title || action) && (
        <>
          <Box sx={{ px: 2.5, py: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
            {action}
          </Box>
          <Divider />
        </>
      )}
      <Box sx={{ p: 2.5 }}>{children}</Box>
    </Card>
  );
}
