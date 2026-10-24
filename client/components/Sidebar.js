'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsIcon from '@mui/icons-material/Settings';
import ApartmentIcon from '@mui/icons-material/Apartment';
import BadgeIcon from '@mui/icons-material/Badge';
import EventNoteIcon from '@mui/icons-material/EventNote';
import CelebrationIcon from '@mui/icons-material/Celebration';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import PeopleIcon from '@mui/icons-material/People';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import PaymentsIcon from '@mui/icons-material/Payments';
import CampaignIcon from '@mui/icons-material/Campaign';
import HistoryIcon from '@mui/icons-material/History';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '@/features/auth/AuthContext';
import { MENU, ROLE_LABEL } from '@/lib/roles';

const ICONS = {
  dashboard: DashboardIcon,
  settings: SettingsIcon,
  departments: ApartmentIcon,
  designations: BadgeIcon,
  leaveTypes: EventNoteIcon,
  holidays: CelebrationIcon,
  users: ManageAccountsIcon,
  employees: PeopleIcon,
  attendance: AccessTimeIcon,
  leave: BeachAccessIcon,
  payroll: PaymentsIcon,
  announcements: CampaignIcon,
  audit: HistoryIcon,
  corrections: FactCheckIcon,
  payslips: ReceiptLongIcon,
  profile: PersonIcon,
};

export default function Sidebar({ onNavigate }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const items = MENU[user?.role] || [];
  let lastSection = null;

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#1e293b', color: '#cbd5e1' }}>
      <Box sx={{ px: 2.5, py: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2,
            bgcolor: 'primary.main',
            color: '#fff',
            display: 'grid',
            placeItems: 'center',
            fontWeight: 800,
          }}
        >
          H
        </Box>
        <Box>
          <Typography sx={{ color: '#fff', fontWeight: 700, lineHeight: 1.15 }}>HCM Lite</Typography>
          <Typography variant="caption" sx={{ color: '#94a3b8' }}>
            {ROLE_LABEL[user?.role] || ''} workspace
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ borderColor: 'rgba(148,163,184,0.2)' }} />

      <List sx={{ px: 1.5, py: 1, overflowY: 'auto', flexGrow: 1 }}>
        {items.map((item) => {
          const showSection = item.section && item.section !== lastSection;
          if (item.section) lastSection = item.section;
          const Icon = ICONS[item.icon] || DashboardIcon;
          const selected = pathname === item.href || pathname.startsWith(item.href + '/');

          return (
            <Fragment key={item.href}>
              {showSection && (
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    px: 1.5,
                    pt: 2,
                    pb: 0.5,
                    color: '#64748b',
                    fontWeight: 700,
                    letterSpacing: 0.8,
                    textTransform: 'uppercase',
                    fontSize: 11,
                  }}
                >
                  {item.section}
                </Typography>
              )}
              <ListItemButton
                component={Link}
                href={item.href}
                selected={selected}
                onClick={onNavigate}
                sx={{
                  borderRadius: 2,
                  mb: 0.25,
                  py: 0.9,
                  color: '#cbd5e1',
                  '& .MuiListItemText-primary': { fontSize: 14 },
                  '&:hover': { bgcolor: 'rgba(148,163,184,0.12)' },
                  '&.Mui-selected': { bgcolor: 'rgba(20,184,166,0.22)', color: '#fff' },
                  '&.Mui-selected:hover': { bgcolor: 'rgba(20,184,166,0.3)' },
                }}
              >
                <ListItemIcon sx={{ minWidth: 38, color: 'inherit' }}>
                  <Icon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </Fragment>
          );
        })}
      </List>
    </Box>
  );
}
