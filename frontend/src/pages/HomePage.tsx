import { Container, Typography, Paper, Box, Button, Divider, Tooltip } from '@mui/material';
import { Link } from 'react-router-dom';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export const HomePage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Northwestern Dining Hall Tracker
        </Typography>
        
        <Typography variant="body1" paragraph>
          <strong>Find healthy meals</strong> at Northwestern dining halls. 
          Get detailed nutrition info to make <strong>better food choices</strong> on campus.
        </Typography>
        
        <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
          What You Can Do:
        </Typography>
        
        <Box component="ul" sx={{ mb: 4, pl: 2 }}>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>Filter meals</strong> by protein, carbs, fiber, and calories
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>Browse by dining hall</strong> to see what's available near you
          </Typography>
          <Typography component="li" variant="body1" sx={{ mb: 1 }}>
            <strong>Make informed choices</strong> based on your dietary goals
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
          <Tooltip title="Search and filter all available meals across campus">
            <Button 
              variant="contained" 
              component={Link} 
              to="/meals" 
              size="large"
            >
              Browse All Meals
            </Button>
          </Tooltip>
          <Tooltip title="View meals available at specific dining halls">
            <Button 
              variant="outlined" 
              component={Link} 
              to="/dining-halls" 
              size="large"
            >
              View Dining Halls
            </Button>
          </Tooltip>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Admin Access
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            <strong>Administrator?</strong> Manage meals and dining halls here.
          </Typography>
          <Tooltip title="Access administrative functions to manage meals and dining halls">
            <Button
              variant="contained"
              color="secondary"
              component={Link}
              to="/admin"
              startIcon={<AdminPanelSettingsIcon />}
              size="large"
            >
              Go to Admin Panel
            </Button>
          </Tooltip>
        </Box>
      </Paper>
    </Container>
  );
}; 