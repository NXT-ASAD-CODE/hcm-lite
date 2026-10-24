'use client';

import Box from '@mui/material/Box';
import PeopleIcon from '@mui/icons-material/People';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import ScheduleIcon from '@mui/icons-material/Schedule';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import BarChartIcon from '@mui/icons-material/BarChart';
import PieChartIcon from '@mui/icons-material/PieChart';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EmptyState from '@/components/EmptyState';
import PageHeader from '@/components/PageHeader';
import Panel from '@/components/Panel';
import StatCard, { StatGrid } from '@/components/StatCard';
import { useAuth } from '@/features/auth/AuthContext';

export default function HrDashboardPage() {
  const { user } = useAuth();

  return (
    <>
      <PageHeader
        title="HR dashboard"
        subtitle={`Welcome, ${user?.name}. People and attendance at a glance.`}
      />

      <StatGrid columns={5}>
        <StatCard label="Headcount" value={null} hint="No employees yet" icon={<PeopleIcon />} />
        <StatCard label="Present today" value={null} hint="No check-ins yet" icon={<EventAvailableIcon />} color="#16a34a" />
        <StatCard label="On leave" value={null} hint="No approved leave" icon={<BeachAccessIcon />} color="secondary.main" />
        <StatCard label="Late today" value={null} hint="No late arrivals" icon={<ScheduleIcon />} color="warning.main" />
        <StatCard label="Pending approvals" value={null} hint="Nothing waiting" icon={<PendingActionsIcon />} color="#dc2626" />
      </StatGrid>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: 'repeat(2, 1fr)' } }}>
        <Panel title="Attendance trend" subtitle="Per day, for the selected dates">
          <EmptyState icon={<ShowChartIcon />} title="No attendance yet" description="The trend line appears after employees start checking in." />
        </Panel>
        <Panel title="Absenteeism by department">
          <EmptyState icon={<BarChartIcon />} title="No data yet" description="Add departments and attendance to see this chart." />
        </Panel>
        <Panel title="Leave by type">
          <EmptyState icon={<PieChartIcon />} title="No leave requests yet" description="Approved leave will be grouped by type here." />
        </Panel>
        <Panel title="Top 5 late-comers">
          <EmptyState icon={<EmojiEventsIcon />} title="No late arrivals" description="Employees who arrive after the grace time will be ranked here." />
        </Panel>
        <Panel title="AI summary" subtitle="Insights written from the numbers above" sx={{ gridColumn: { lg: '1 / -1' } }}>
          <EmptyState icon={<AutoAwesomeIcon />} title="Nothing to summarize yet" description="After there is data, press Summarize to get 3 to 5 short insights." />
        </Panel>
      </Box>
    </>
  );
}
