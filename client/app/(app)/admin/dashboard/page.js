'use client';

import Link from 'next/link';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import PeopleIcon from '@mui/icons-material/People';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PaymentsIcon from '@mui/icons-material/Payments';
import PaidIcon from '@mui/icons-material/Paid';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EmptyState from '@/components/EmptyState';
import PageHeader from '@/components/PageHeader';
import Panel from '@/components/Panel';
import StatCard, { StatGrid } from '@/components/StatCard';
import { useAuth } from '@/features/auth/AuthContext';

const STEPS = [
  { n: 1, title: 'Company settings', text: 'Office hours, grace time, weekend, office location', href: '/admin/settings' },
  { n: 2, title: 'Departments and designations', text: 'Create the teams and job titles', href: '/admin/departments' },
  { n: 3, title: 'Leave types and holidays', text: 'Quotas and public holidays', href: '/admin/leave-types' },
  { n: 4, title: 'Create an HR account', text: 'HR will register the employees', href: '/admin/users' },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <>
      <PageHeader
        title="Company dashboard"
        subtitle={`Welcome, ${user?.name}. These numbers are calculated from real records, so they fill up as you add data.`}
      />

      <StatGrid columns={4}>
        <StatCard label="Headcount" value={null} hint="No employees yet" icon={<PeopleIcon />} />
        <StatCard label="Attrition (year to date)" value={null} hint="No exits recorded" icon={<TrendingDownIcon />} color="warning.main" />
        <StatCard label="Payroll cost" value={null} hint="No payroll run yet" icon={<PaymentsIcon />} color="secondary.main" />
        <StatCard label="Average salary" value={null} hint="No salaries yet" icon={<PaidIcon />} color="#0ea5e9" />
      </StatGrid>

      <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', lg: '3fr 2fr' } }}>
        <Panel title="Getting started" subtitle="Set up your company in this order">
          <List disablePadding>
            {STEPS.map((step) => (
              <ListItemButton key={step.n} component={Link} href={step.href} sx={{ borderRadius: 2, gap: 2 }}>
                <Box
                  sx={{
                    width: 30,
                    height: 30,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    fontWeight: 700,
                    fontSize: 14,
                    flexShrink: 0,
                  }}
                >
                  {step.n}
                </Box>
                <ListItemText primary={step.title} secondary={step.text} />
                <Chip size="small" label="Milestone 02" variant="outlined" />
              </ListItemButton>
            ))}
          </List>
        </Panel>

        <Panel title="AI summary" subtitle="Insights written from your dashboard numbers">
          <EmptyState
            icon={<AutoAwesomeIcon />}
            title="Nothing to summarize yet"
            description="Once there is data, the Summarize button will give 3 to 5 short insights here."
          />
        </Panel>
      </Box>

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 3 }}>
        Charts for headcount by department, payroll cost by department and the audit feed appear here once data exists.
      </Typography>
    </>
  );
}
