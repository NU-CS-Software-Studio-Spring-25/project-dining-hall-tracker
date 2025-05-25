import { Container, Typography, Paper, Box, Button, Divider } from '@mui/material';
import { Link } from 'react-router-dom';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export const HomePage = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h3" component="h1" gutterBottom>
          Welcome to the Dining Hall Tracker
        </Typography>
        
        <Typography variant="body1" paragraph>
          Finding nutritious meals across campus dining halls can be challenging. 
          Our app helps Northwestern students make informed choices by providing 
          detailed nutritional information on meals served at campus dining halls.
        </Typography>
        
        <Typography variant="body1" paragraph>
          With the Dining Hall Tracker, you can:
        </Typography>
        
        <Box component="ul" sx={{ mb: 4 }}>
          <Typography component="li" variant="body1">
            Filter meals by protein, carbs, fiber and other macronutrients
          </Typography>
          <Typography component="li" variant="body1">
            Browse meals by specific dining halls
          </Typography>
          <Typography component="li" variant="body1">
            Make better nutritional choices based on your dietary needs
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
          <Button 
            variant="contained" 
            component={Link} 
            to="/meals" 
            size="large"
          >
            Browse All Meals
          </Button>
          <Button 
            variant="outlined" 
            component={Link} 
            to="/dining-halls" 
            size="large"
          >
            View Dining Halls
          </Button>
        </Box>

        <Divider sx={{ my: 4 }} />

        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            Admin Access
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Are you an administrator? Access the admin panel to manage meals and dining halls.
          </Typography>
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
        </Box>
      </Paper>
    </Container>
  );
}; 