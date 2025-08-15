import React, { useState } from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  IconButton,
  AppBar,
  Toolbar,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  Games as GamesIcon,
  Lightbulb as LightbulbIcon,
  LocationOn as LocationIcon,
  Person as PersonIcon,
  Menu as MenuIcon,
  Settings as SettingsIcon,
  Person as ChildIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLanguageContext } from '../contexts/LanguageContext';

const drawerWidth = 280;

const Navigation: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLanguageContext();

  const menuItems = [
    { text: t.dashboard, icon: <DashboardIcon />, path: '/dashboard' },
    { text: t.children, icon: <ChildIcon />, path: '/children' },
    { text: t.evaluation, icon: <AssessmentIcon />, path: '/evaluation' },
    { text: t.progress, icon: <TimelineIcon />, path: '/suivi' },
    { text: t.activities, icon: <GamesIcon />, path: '/activites' },
    { text: t.advice, icon: <LightbulbIcon />, path: '/conseils' },
    { text: t.resources, icon: <LocationIcon />, path: '/ressources' },
    { text: t.proSpace, icon: <PersonIcon />, path: '/espace-pro' },
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const drawerContent = (
    <>
      <Box sx={{ p: 3 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
          Kidaily
        </Typography>
        <Typography variant="body2" sx={{ mt: 1, opacity: 0.8 }}>
          Suivi du développement de l'enfant
        </Typography>
      </Box>
      
      <Divider sx={{ backgroundColor: 'rgba(255,255,255,0.2)' }} />
      
      <List sx={{ mt: 2, flexGrow: 1 }}>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={() => handleNavigation(item.path)}
            sx={{
              mx: 1,
              mb: 1,
              borderRadius: 2,
              backgroundColor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
              },
              cursor: 'pointer',
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              sx={{
                '& .MuiListItemText-primary': {
                  fontSize: '0.95rem',
                  fontWeight: location.pathname === item.path ? 600 : 400,
                },
              }}
            />
          </ListItem>
        ))}
      </List>
      
      {/* Section profil en bas */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.2)' }}>
        <ListItem
          onClick={() => handleNavigation('/profile-edit')}
          sx={{
            borderRadius: 2,
            backgroundColor: location.pathname === '/profile-edit' ? 'rgba(255,255,255,0.1)' : 'transparent',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.1)',
            },
            cursor: 'pointer',
            mb: 1,
          }}
        >
          <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText 
            primary={t.profile}
            sx={{
              '& .MuiListItemText-primary': {
                fontSize: '0.9rem',
                fontWeight: location.pathname === '/profile-edit' ? 600 : 400,
              },
            }}
          />
        </ListItem>
      </Box>
    </>
  );

  return (
    <>
      {/* AppBar pour mobile */}
      {isMobile && (
        <AppBar
          position="fixed"
          sx={{
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            ml: { sm: `${drawerWidth}px` },
            display: { sm: 'none' },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
              Kidaily
            </Typography>
          </Toolbar>
        </AppBar>
      )}

      {/* Navigation drawer */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Drawer mobile */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: '#1976d2',
              color: 'white',
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Drawer desktop */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: '#1976d2',
              color: 'white',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* Toolbar pour compenser l'AppBar mobile */}
      {isMobile && <Toolbar />}
    </>
  );
};

export default Navigation; 