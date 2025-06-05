import { AppBar, Toolbar, Typography, Button, Box, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const NavBar = () => {
  const { user, logout } = useAuth();
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
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
        <Box sx={{ display: 'flex', gap: 2 }}>
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
          
          {isAuthenticated && (
            <Tooltip title="Manage meals and dining halls">
              <Button color="inherit" component={Link} to="/admin">
                Admin
              </Button>
            </Tooltip>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}; 