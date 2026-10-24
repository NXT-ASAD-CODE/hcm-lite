'use client';

import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ScheduleIcon from '@mui/icons-material/Schedule';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CampaignIcon from '@mui/icons-material/Campaign';
import EmptyState from '@/components/EmptyState';
import PageHeader from '@/components/PageHeader';
import Panel from '@/components/Panel';
import StatCard, { StatGrid } from '@/components/StatCard';
import { useAuth } from '@/features/auth/AuthContext';

export default function EmployeeDashboardPage() {
  const { user } = useAuth();
  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <>
      <PageHeader title={`Hello, ${user?.name}`} subtitle={today} />

      <Panel title="Today" subtitle="Check in when you arrive and check out when you leave" sx={{ mb: 3 }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
          <Button variant="contained" size="large" disabled>
            Check in
          </Button>
          <Button variant="outlined" size="large" disabled>
            Check out
          </Button>
          <Typography variant="body2" color="text.secondary">
            Check-in is switched on in Milestone 04 (Attendance).
          </Typography>
        </Stack>
      </Panel>

      <StatGrid columns={4}>
        <StatCard label="Hours this week" value={null} hint="Target: 40 hours" icon={<AccessTimeIcon />} />
        <StatCard label="Late count (this month)" value={null} hint="No check-ins yet" icon={<ScheduleIcon />} color="warning.main" />
        <StatCard label="Leave balance" value={null} hint="Shown by leave type" icon={<BeachAccessIcon />} color="secondary.main" />
        <StatCard label="Last payslip" value={null} hint="No payslip yet" icon={<ReceiptLongIcon />} color="#0ea5e9" />
      </StatGrid>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' } }}>
        <Panel title="Announcements">
          <EmptyState icon={<CampaignIcon />} title="No announcements" description="Messages from Admin and HR will appear here." />
        </Panel>
        <Panel title="Ask my assistant" subtitle="Questions about your leave, attendance or company rules">
          <Alert severity="info" sx={{ mb: 2 }}>
            The AI assistant is added in Milestone 08.
          </Alert>
          <TextField disabled placeholder="For example: How many sick leaves do I have left?" />
        </Panel>
      </Box>
    </>
  );
}
