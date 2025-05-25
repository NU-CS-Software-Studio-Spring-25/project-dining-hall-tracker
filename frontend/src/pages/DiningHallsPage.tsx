import { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Card, CardContent, CardActions, Button, 
  CircularProgress, Box, Divider, Chip, CardMedia, IconButton
} from '@mui/material';
import { Star, StarBorder } from '@mui/icons-material';
import { api } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import type { DiningHall } from '../types/index';

const getDiningHallImage = (name: string): string => {
  const normalizedName = name.toLowerCase().replace(/\s+/g, '');
  
  const imageMap: { [key: string]: string } = {
    'allison': '/images/allison.png',
    'elder': '/images/elder.png',
    'plexeast': '/images/plexeast.jpeg',
    'plexwest': '/images/plexwest.jpg',
    'sarge': '/images/sarge.png',
  };
  
  for (const [key, imagePath] of Object.entries(imageMap)) {
    if (normalizedName.includes(key)) {
      return imagePath;
    }
  }
  
  return '/images/purpleplate.png';
};

export const DiningHallsPage = () => {
  console.log('DiningHallsPage component is rendering');
  
  const [diningHalls, setDiningHalls] = useState<DiningHall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDiningHall, setSelectedDiningHall] = useState<DiningHall | null>(null);
  
  const { user } = useAuth();
  const { isFavorite, toggleFavorite } = useFavorites();
  
  const handleFavoriteClick = async (mealName: string) => {
    if (!user) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }
    
    try {
      await toggleFavorite(mealName);
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };
  
  useEffect(() => {
    const fetchDiningHalls = async () => {
      setLoading(true);
      try {
        const data = await api.getDiningHalls();
        setDiningHalls(data);
        setError(null);
      } catch (err) {
        setError('Failed to load dining halls. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDiningHalls();
  }, []);
  
  const handleSelectDiningHall = async (id: number) => {
    setLoading(true);
    try {
      const data = await api.getDiningHall(id);
      setSelectedDiningHall(data);
      setError(null);
    } catch (err) {
      setError(`Failed to load details for dining hall. Please try again.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const handleBackToList = () => {
    setSelectedDiningHall(null);
  };
  
  if (loading && diningHalls.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }
  
  if (error && diningHalls.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py:.4 }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Container>
    );
  }
  
  if (selectedDiningHall) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center' }}>
          <Button variant="outlined" onClick={handleBackToList} sx={{ mr: 2 }}>
            Back to All Dining Halls
          </Button>
          <Typography variant="h4" component="h1">
            {selectedDiningHall.name}
          </Typography>
        </Box>
        
        <Typography variant="subtitle1" sx={{ mb: 3 }}>
          Location: {selectedDiningHall.location}
        </Typography>
        
        <Typography variant="h5" gutterBottom>
          Available Meals
        </Typography>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {selectedDiningHall.meals && selectedDiningHall.meals.length > 0 ? (
              <Grid container spacing={3}>
                {selectedDiningHall.meals.map((meal) => (
                  <Grid item xs={12} md={6} lg={4} key={meal.id}>
                    <Card>
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                          <Typography variant="h6" gutterBottom sx={{ flex: 1 }}>
                            {meal.name}
                          </Typography>
                          <IconButton
                            onClick={() => handleFavoriteClick(meal.name)}
                            size="small"
                            sx={{ ml: 1 }}
                          >
                            {user && isFavorite(meal.name) ? (
                              <Star color="primary" />
                            ) : (
                              <StarBorder color={user ? "action" : "disabled"} />
                            )}
                          </IconButton>
                        </Box>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Serving Size: {meal.serving_size}
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
                          <Chip label={`Protein: ${meal.protein}g`} />
                          <Chip label={`Carbs: ${meal.carbs}g`} />
                          <Chip label={`Fat: ${meal.fat}g`} />
                          <Chip label={`Fiber: ${meal.fiber}g`} />
                          <Chip label={`Calories: ${meal.calories}`} color="primary" />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Typography>No meals available for this dining hall.</Typography>
            )}
          </>
        )}
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Campus Dining Halls
      </Typography>
      
      <Grid container spacing={3}>
        {diningHalls.map((diningHall) => (
          <Grid item xs={12} sm={6} md={4} key={diningHall.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={getDiningHallImage(diningHall.name)}
                alt={`${diningHall.name} dining hall`}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h5" component="h2" gutterBottom>
                  {diningHall.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Location: {diningHall.location}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  onClick={() => handleSelectDiningHall(diningHall.id)}
                >
                  View Meals
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}; 