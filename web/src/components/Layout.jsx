import React, { useState, useEffect } from 'react';
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  Chip,
  Collapse
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  Wifi as WifiIcon,
  Assignment as AssignmentIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  ReportProblem as ReportIcon,
  Engineering as EngineeringIcon,
  AddLocationAlt as AddLocationAltIcon,
  Notifications as NotificationsIcon,
  KeyboardArrowDown as ArrowIcon,
  SignalWifi4Bar as SignalIcon,
  ChevronRight as ChevronRightIcon,
  Settings as SettingsIcon,
  Chat as ChatIcon,
  Diversity3 as CommunityIcon,
  CardMembership as SubscriptionIcon,
  ExpandMore as ExpandMoreIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { logout } from '../services/auth';

const drawerWidth = 260;

const Layout = ({ children, title = 'Dashboard Overview' }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [openGroups, setOpenGroups] = useState({});
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleLogout = async () => { await logout(); navigate('/login'); };

  const toggleGroup = (label) => setOpenGroups(prev => ({ ...prev, [label]: !prev[label] }));
  const isGroupOpen = (group) => {
    if (openGroups[group.label] !== undefined) return openGroups[group.label];
    // auto-open if any child is active
    return group.items.some(item => location.pathname === item.path);
  };

  const menuGroups = [
    {
      label: 'Utama',
      items: [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
      ]
    },
    {
      label: 'Manajemen',
      items: [
        { text: 'Customer', icon: <PeopleIcon />, path: '/customers' },
        { text: 'Layanan', icon: <WifiIcon />, path: '/packages' },
        { text: 'Pesanan', icon: <AssignmentIcon />, path: '/installations' },
        { text: 'Pemasangan', icon: <AddLocationAltIcon />, path: '/orders' },
      ]
    },
    {
      label: 'Dukungan',
      items: [
        { text: 'Gangguan', icon: <ReportIcon />, path: '/issues' },
        { text: 'Notifikasi', icon: <NotificationsIcon />, path: '/notifications' },
        { text: 'Chat CS', icon: <ChatIcon />, path: '/chat' },
        { text: 'Komunitas', icon: <CommunityIcon />, path: '/community' },
        { text: 'Masa Tenggang', icon: <SubscriptionIcon />, path: '/subscriptions' },
      ]
    },
    {
      label: 'Lainnya',
      items: [
        { text: 'Pengaturan', icon: <SettingsIcon />, path: '/settings' },
      ]
    },
  ];

  if (user.role === 'admin') {
    menuGroups[1].items.push({ text: 'Teknisi', icon: <EngineeringIcon />, path: '/technicians' });
  }

  const isActive = (path) => location.pathname === path;

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Brand */}
      <Box sx={{
        px: 3,
        py: 2.5,
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        borderBottom: '1px solid rgba(255,255,255,0.07)'
      }}>
        <Box sx={{
          width: 38,
          height: 38,
          borderRadius: 2,
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(59,130,246,0.4)',
        }}>
          <SignalIcon sx={{ color: '#fff', fontSize: 20 }} />
        </Box>
        <Box>
          <Typography variant="body1" fontWeight={800} sx={{ color: '#f8fafc', letterSpacing: 0.5, lineHeight: 1.2 }}>
            WiFi Net
          </Typography>
          <Typography variant="caption" sx={{ color: '#64748b', fontSize: 10, letterSpacing: 0.5, textTransform: 'uppercase' }}>
            Admin Panel
          </Typography>
        </Box>
      </Box>

      {/* Menu Groups — collapsible dropdowns */}
      <Box sx={{ flex: 1, overflowY: 'auto', px: 2, py: 2 }}>
        {menuGroups.map((group, gi) => {
          const expanded = isGroupOpen(group);
          const hasActive = group.items.some(item => location.pathname === item.path);
          return (
            <Box key={gi} sx={{ mb: 0.5 }}>
              {/* Group header — clickable to toggle */}
              <ListItemButton
                onClick={() => toggleGroup(group.label)}
                sx={{
                  px: 1.5, py: 0.75, borderRadius: 2, mb: 0.5,
                  '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' },
                }}
              >
                <Typography variant="caption" sx={{
                  color: hasActive ? '#60a5fa' : '#475569',
                  fontSize: 10, fontWeight: 700,
                  textTransform: 'uppercase', letterSpacing: 1,
                  flex: 1, userSelect: 'none',
                }}>
                  {group.label}
                </Typography>
                <ExpandMoreIcon sx={{
                  fontSize: 16,
                  color: hasActive ? '#60a5fa' : '#475569',
                  transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
                  transition: 'transform 0.25s ease',
                }} />
              </ListItemButton>

              {/* Collapsible items */}
              <Collapse in={expanded} timeout={220} unmountOnExit>
                <List dense disablePadding sx={{ pl: 0.5 }}>
                  {group.items.map((item) => (
                    <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
                      <Tooltip title={item.text} placement="right" arrow>
                        <ListItemButton
                          selected={isActive(item.path)}
                          onClick={() => navigate(item.path)}
                          sx={{
                            borderRadius: 2, py: 0.9, pl: 1.5, pr: 1, minHeight: 40,
                            borderLeft: isActive(item.path) ? '3px solid #3b82f6' : '3px solid transparent',
                            ml: 0.5,
                          }}
                        >
                          <ListItemIcon sx={{
                            minWidth: 34,
                            color: isActive(item.path) ? '#60a5fa' : '#64748b',
                            transition: 'color 0.2s',
                            '& svg': { fontSize: 19 }
                          }}>
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText
                            primary={item.text}
                            primaryTypographyProps={{
                              fontSize: 13,
                              fontWeight: isActive(item.path) ? 700 : 500,
                              color: isActive(item.path) ? '#f1f5f9' : '#94a3b8'
                            }}
                          />
                        </ListItemButton>
                      </Tooltip>
                    </ListItem>
                  ))}
                </List>
              </Collapse>

              {gi < menuGroups.length - 1 && (
                <Divider sx={{ borderColor: 'rgba(255,255,255,0.05)', mt: 0.5, mb: 0.5 }} />
              )}
            </Box>
          );
        })}
      </Box>

      {/* User Panel */}
      <Box sx={{
        px: 2,
        py: 2,
        borderTop: '1px solid rgba(255,255,255,0.07)',
      }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            p: 1.5,
            borderRadius: 2,
            background: 'rgba(255,255,255,0.05)',
            cursor: 'pointer',
            '&:hover': { background: 'rgba(255,255,255,0.08)' },
            transition: 'background 0.2s'
          }}
          onClick={handleMenu}
        >
          <Avatar sx={{
            width: 34,
            height: 34,
            fontSize: 13,
            fontWeight: 700,
            background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
          }}>
            {user.name ? user.name[0].toUpperCase() : 'A'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="body2" fontWeight={600} sx={{ color: '#f1f5f9', fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {user.name || 'Admin'}
            </Typography>
            <Chip
              label={user.role || 'admin'}
              size="small"
              sx={{
                height: 16,
                fontSize: 9,
                fontWeight: 700,
                textTransform: 'capitalize',
                bgcolor: 'rgba(59,130,246,0.2)',
                color: '#60a5fa',
                border: 'none',
                px: 0.2,
              }}
            />
          </Box>
          <ArrowIcon sx={{ fontSize: 16, color: '#64748b' }} />
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          transformOrigin={{ horizontal: 'left', vertical: 'bottom' }}
          anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
          PaperProps={{ sx: { borderRadius: 2, minWidth: 180, boxShadow: '0 8px 24px rgba(0,0,0,0.12)', border: '1px solid #e2e8f0' } }}
        >
          <Box sx={{ px: 2, py: 1, borderBottom: '1px solid #f1f5f9' }}>
            <Typography variant="body2" fontWeight={700}>{user.name || 'Admin'}</Typography>
            <Typography variant="caption" color="text.secondary">{user.email || ''}</Typography>
          </Box>
          <MenuItem onClick={handleClose} sx={{ gap: 1.5, mt: 0.5 }}>
            <PersonIcon fontSize="small" sx={{ color: '#64748b' }} /> Profil Saya
          </MenuItem>
          <MenuItem onClick={handleLogout} sx={{ gap: 1.5, color: '#ef4444' }}>
            <LogoutIcon fontSize="small" /> Keluar
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'rgba(255,255,255,0.95)',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ gap: 2, minHeight: 64 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 1, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" fontWeight={700} sx={{ fontSize: 17, lineHeight: 1.2 }}>
              {title}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Tooltip title="Notifikasi">
              <IconButton
                size="medium"
                onClick={() => navigate('/notifications')}
                sx={{
                  bgcolor: '#f1f5f9',
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#e2e8f0' },
                  width: 40,
                  height: 40,
                }}
              >
                <Badge badgeContent={0} color="error">
                  <NotificationsIcon sx={{ fontSize: 20, color: '#64748b' }} />
                </Badge>
              </IconButton>
            </Tooltip>
            <Tooltip title={user.name || 'Admin'}>
              <Box
                onClick={handleMenu}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  cursor: 'pointer',
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 2,
                  '&:hover': { bgcolor: '#f1f5f9' },
                  transition: 'background 0.2s',
                }}
              >
                <Avatar sx={{
                  width: 34,
                  height: 34,
                  fontSize: 13,
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #3b82f6, #2563eb)',
                }}>
                  {user.name ? user.name[0].toUpperCase() : 'A'}
                </Avatar>
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                  <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13, lineHeight: 1.2 }}>
                    {user.name || 'Admin'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, lineHeight: 1 }}>
                    {user.role || 'admin'}
                  </Typography>
                </Box>
                <ArrowIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
              </Box>
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          bgcolor: 'background.default',
        }}
      >
        <Toolbar sx={{ minHeight: 64 }} />
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
