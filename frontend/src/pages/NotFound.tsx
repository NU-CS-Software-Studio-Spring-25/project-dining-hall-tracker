import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <Container 
      maxWidth="md" 
      sx={{ 
        py: 8, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        textAlign: 'center',
        minHeight: '60vh'
      }}
    >
      <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 'bold', mb: 2 }}>
        404
      </Typography>
      
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Oops, no food here! 🍽️
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 400 }}>
        The page you're looking for seems to have wandered off to find a snack. 
        Let's get you back to where the meals are!
      </Typography>
      
      <Button
        component={Link}
        to="/"
        variant="contained"
        size="large"
        sx={{ 
          px: 4, 
          py: 1.5,
          borderRadius: 2,
          textTransform: 'none',
          fontSize: '1.1rem'
        }}
      >
        🏠 Go Home to Find a Meal
      </Button>
      
      <Box sx={{ mt: 4 }}>
        <Typography variant="body2" color="text.secondary">
          Or try these popular destinations:
        </Typography>
        <Box sx={{ mt: 2, display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Button component={Link} to="/dining-halls" variant="outlined" size="small">
            Dining Halls
          </Button>
          <Button component={Link} to="/meals" variant="outlined" size="small">
            Browse Meals
          </Button>
        </Box>
      </Box>
    </Container>
  );
};