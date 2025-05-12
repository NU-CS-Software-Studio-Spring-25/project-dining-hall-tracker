import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export const NavBar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Dining Hall Tracker
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
        </Box>
      </Toolbar>
    </AppBar>
  );
}; 