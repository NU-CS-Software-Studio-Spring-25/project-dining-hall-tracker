import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Tooltip, 
  CircularProgress,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  useMediaQuery,
  useTheme
} from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const NavBar = () => {
  const { user, logout, isLoading } = useAuth();
  const isAdminAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.location.reload(); // Refresh to update admin state
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  const menuItems = [
    { text: 'Home', path: '/', tooltip: 'Return to homepage' },
    { text: 'Meals', path: '/meals', tooltip: 'Browse and filter all meals' },
    { text: 'Dining Halls', path: '/dining-halls', tooltip: 'View meals by dining hall location' },
  ];

  const drawer = (
    <Box sx={{ width: 250 }}>
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Menu</Typography>
        <IconButton onClick={handleDrawerToggle}>
          <CloseIcon />
        </IconButton>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton onClick={() => handleNavigate(item.path)}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {isLoading ? (
          <ListItem>
            <CircularProgress size={20} />
          </ListItem>
        ) : (
          <>
            {user ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleNavigate('/profile')}>
                    <ListItemText primary="Profile" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}>
                    <ListItemText primary="Logout" />
                  </ListItemButton>
                </ListItem>
              </>
            ) : (
              <>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleNavigate('/login')}>
                    <ListItemText primary="Login" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleNavigate('/signup')}>
                    <ListItemText primary="Sign Up" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
            {isAdminAuthenticated && (
              <>
                <Divider />
                <ListItem disablePadding>
                  <ListItemButton onClick={() => handleNavigate('/admin')}>
                    <ListItemText primary="Admin" />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton onClick={() => {
                    handleAdminLogout();
                    setMobileOpen(false);
                  }}>
                    <ListItemText primary="Admin Logout" />
                  </ListItemButton>
                </ListItem>
              </>
            )}
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant="h6" 
            component={Link} 
            to="/"
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none', 
              color: 'inherit',
              transition: 'all 0.3s ease-in-out',
              '&:hover': {
                color: '#f0f0f0',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
                transform: 'scale(1.02)'
              }
            }}
          >
            PurplePlate
          </Typography>
          
          {isMobile ? (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="end"
              onClick={handleDrawerToggle}
            >
              <MenuIcon />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Tooltip title="Return to homepage">
                <Button color="inherit" component={Link} to="/">
                  Home
                </Button>
              </Tooltip>
              <Tooltip title="Browse and filter all meals">
                <Button color="inherit" component={Link} to="/meals">
                  Meals
                </Button>
              </Tooltip>
              <Tooltip title="View meals by dining hall location">
                <Button color="inherit" component={Link} to="/dining-halls">
                  Dining Halls
                </Button>
              </Tooltip>
              
              {/* Show loading spinner during auth check */}
              {isLoading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <>
                  {/* Regular user authentication */}
                  {user ? (
                    <>
                      <Tooltip title="View your favorite meals and profile">
                        <Button color="inherit" component={Link} to="/profile">
                          Profile
                        </Button>
                      </Tooltip>
                      <Tooltip title="Sign out of your account">
                        <Button color="inherit" onClick={handleLogout}>
                          Logout
                        </Button>
                      </Tooltip>
                    </>
                  ) : (
                    <>
                      <Tooltip title="Sign in to save favorites">
                        <Button color="inherit" component={Link} to="/login">
                          Login
                        </Button>
                      </Tooltip>
                      <Tooltip title="Create a new account">
                        <Button color="inherit" component={Link} to="/signup">
                          Sign Up
                        </Button>
                      </Tooltip>
                    </>
                  )}
                  
                  {/* Admin authentication (separate system) */}
                  {isAdminAuthenticated && (
                    <>
                      <Tooltip title="Manage meals and dining halls">
                        <Button color="inherit" component={Link} to="/admin">
                          Admin
                        </Button>
                      </Tooltip>
                      <Tooltip title="Sign out of admin account">
                        <Button color="inherit" onClick={handleAdminLogout} sx={{ ml: 1 }}>
                          Admin Logout
                        </Button>
                      </Tooltip>
                    </>
                  )}
                </>
              )}
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
}; 