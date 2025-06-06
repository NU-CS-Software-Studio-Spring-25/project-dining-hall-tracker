import { useState } from 'react';

import RestaurantMenuIcon from '@mui/icons-material/RestaurantMenu';
import StorefrontIcon from '@mui/icons-material/Storefront';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Paper,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { DinnerDining, Sync } from '@mui/icons-material';
import { useNotification } from '../contexts/NotificationContext';
import { api } from '../services/api';

export const AdminPage = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const [isSyncing, setIsSyncing] = useState(false);

  // Check if already authenticated
  useState(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // In a real application, this would be an API call to verify credentials
      // For now, we'll use a simple password check
      if (password === 'admin123') {
        // Replace with a secure password in production
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        setError('Invalid password');
      }
    } catch (err) {
      setError('An error occurred during login');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
  };

  const handleSyncDiningData = async () => {
    setIsSyncing(true);
    try {
      const response = await api.syncDiningData();
      showSuccess(`Successfully synced ${response.meal_count} meals from Northwestern dining API!`);
    } catch (error) {
      console.error('Sync failed:', error);
      showError('Failed to sync dining data. Please try again.');
    } finally {
      setIsSyncing(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth='sm' sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant='h4' component='h1' gutterBottom>
            Admin Login
          </Typography>

          <form onSubmit={handleLogin}>
            <Box sx={{ mb: 3 }}>
              <TextField
                fullWidth
                label='Password'
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!error}
                helperText={error}
                disabled={loading}
              />
            </Box>

            <Button
              type='submit'
              variant='contained'
              fullWidth
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </form>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth='lg' sx={{ py: 4 }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4,
        }}
      >
        <Typography variant='h4' component='h1'>
          Admin Dashboard
        </Typography>
        <Button variant='outlined' color='error' onClick={handleLogout}>
          Logout
        </Button>
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Tooltip title="Sync dining data">
                    <Sync sx={{ fontSize: 40, mr: 2 }} />
                  </Tooltip>
                  <Typography variant='h5' component='h2'>
                    Sync Dining Data
                  </Typography>
                </Box>
                <Typography variant='body1' color='text.secondary'>
                  Fetch the latest menu data from Northwestern's dining API.
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size='small'
                  color='primary'
                  onClick={handleSyncDiningData}
                  disabled={isSyncing}
                >
                  {isSyncing ? 'Syncing...' : 'Sync Now'}
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Tooltip title="Manage meals">
                    <DinnerDining sx={{ fontSize: 40, mr: 2 }} />
                  </Tooltip>
                  <Typography variant='h5' component='h2'>
                    Manage Meals
                  </Typography>
                </Box>
                <Typography variant='body1' color='text.secondary'>
                  Add, edit, or remove meals from the dining halls.
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size='small'
                  color='primary'
                  onClick={() => navigate('/admin/meals')}
                >
                  Manage Meals
                </Button>
              </CardActions>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Tooltip title="Manage dining halls">
                    <StorefrontIcon sx={{ fontSize: 40, mr: 2 }} />
                  </Tooltip>
                  <Typography variant='h5' component='h2'>
                    Manage Dining Halls
                  </Typography>
                </Box>
                <Typography variant='body1' color='text.secondary'>
                  Add, edit, or remove dining halls from the system.
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size='small'
                  color='primary'
                  onClick={() => navigate('/admin/dining-halls')}
                >
                  Manage Dining Halls
                </Button>
              </CardActions>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
