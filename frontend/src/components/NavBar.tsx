import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
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
            '&:hover': {
              opacity: 0.8
            }
          }}
        >
          PurplePlate
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button color="inherit" component={Link} to="/">
            Home
          </Button>
          <Button color="inherit" component={Link} to="/meals">
            Meals
          </Button>
          <Button color="inherit" component={Link} to="/dining-halls">
            Dining Halls
          </Button>
          
          {user ? (
            <>
              <Button color="inherit" component={Link} to="/profile">
                Profile
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button color="inherit" component={Link} to="/signup">
                Sign Up
              </Button>
            </>
          )}
          
          {isAuthenticated && (
            <Button color="inherit" component={Link} to="/admin">
              Admin
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}; 