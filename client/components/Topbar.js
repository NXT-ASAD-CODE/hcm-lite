'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LockIcon from '@mui/icons-material/Lock';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '@/features/auth/AuthContext';
import { DRAWER_WIDTH } from '@/lib/layout';
import { ROLE_LABEL } from '@/lib/roles';

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [anchor, setAnchor] = useState(null);

  const initials = (user?.name || '?')
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  function handleLogout() {
    setAnchor(null);
    logout();
    router.replace('/login');
  }

  return (
    <AppBar
      position="fixed"
      color="inherit"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${DRAWER_WIDTH}px)` },
        ml: { md: `${DRAWER_WIDTH}px` },
        borderBottom: '1px solid',
        borderColor: 'divider',
        bgcolor: 'background.paper',
      }}
    >
      <Toolbar>
        <IconButton edge="start" onClick={onMenuClick} sx={{ mr: 1, display: { md: 'none' } }} aria-label="open menu">
          <MenuIcon />
        </IconButton>
        <Box sx={{ flexGrow: 1 }} />
        <Chip size="small" color="primary" variant="outlined" label={ROLE_LABEL[user?.role] || ''} sx={{ mr: 1 }} />
        <Tooltip title="Notifications">
          <IconButton component={Link} href="/notifications" aria-label="notifications">
            <NotificationsIcon />
          </IconButton>
        </Tooltip>
        <IconButton onClick={(e) => setAnchor(e.currentTarget)} sx={{ ml: 0.5 }} aria-label="account menu">
          <Avatar sx={{ width: 34, height: 34, bgcolor: 'primary.main', fontSize: 14 }}>{initials}</Avatar>
        </IconButton>
        <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
          <Box sx={{ px: 2, py: 1 }}>
            <Typography variant="subtitle2">{user?.name}</Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem
            onClick={() => {
              setAnchor(null);
              router.push('/change-password');
            }}
          >
            <ListItemIcon>
              <LockIcon fontSize="small" />
            </ListItemIcon>
            Change password
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon fontSize="small" />
            </ListItemIcon>
            Log out
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
