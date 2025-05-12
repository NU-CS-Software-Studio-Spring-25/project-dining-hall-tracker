import { useState, useEffect } from 'react';
import { 
  Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Box, TextField, MenuItem, Button, TableSortLabel, CircularProgress 
} from '@mui/material';
import { api } from '../services/api';
import type { Meal, NutrientFilterParams } from '../types/index';

export const MealsPage = () => {
  console.log('MealsPage component is rendering');
  
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for filtering
  const [filter, setFilter] = useState<NutrientFilterParams>({
    nutrient: 'protein',
    amount: 0
  });
  
  // State for sorting
  const [orderBy, setOrderBy] = useState<keyof Meal>('name');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  
  // Nutrient options for dropdown
  const nutrientOptions = [
    { value: 'protein', label: 'Protein (g)' },
    { value: 'carbs', label: 'Carbs (g)' },
    { value: 'fat', label: 'Fat (g)' },
    { value: 'fiber', label: 'Fiber (g)' },
    { value: 'calories', label: 'Calories' }
  ];
  
  // Load meals
  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const data = await api.getMeals();
        setMeals(data);
        setError(null);
      } catch (err) {
        setError('Failed to load meals. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchMeals();
  }, []);
  
  // Apply filter
  const handleFilterApply = async () => {
    setLoading(true);
    try {
      const data = await api.getMeals({
        nutrient: filter.nutrient,
        amount: filter.amount
      });
      setMeals(data);
      setError(null);
    } catch (err) {
      setError('Failed to apply filter. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Reset filter
  const handleFilterReset = async () => {
    setFilter({
      nutrient: 'protein',
      amount: 0
    });
    
    setLoading(true);
    try {
      const data = await api.getMeals();
      setMeals(data);
      setError(null);
    } catch (err) {
      setError('Failed to reset filter. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle sorting
  const handleRequestSort = (property: keyof Meal) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };
  
  // Sort function for client-side sorting
  const sortedMeals = [...meals].sort((a, b) => {
    const aValue = a[orderBy] as any;
    const bValue = b[orderBy] as any;
    
    if (order === 'asc') {
      return aValue < bValue ? -1 : 1;
    } else {
      return aValue > bValue ? -1 : 1;
    }
  });
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        All Meals
      </Typography>
      
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}
      
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          Filter by Nutrition
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <TextField
            select
            label="Nutrient"
            value={filter.nutrient}
            onChange={(e) => setFilter({ ...filter, nutrient: e.target.value })}
            sx={{ minWidth: 150 }}
          >
            {nutrientOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          
          <TextField
            label="Minimum Amount"
            type="number"
            inputProps={{ min: 0 }}
            value={filter.amount}
            onChange={(e) => setFilter({ ...filter, amount: Number(e.target.value) })}
          />
          
          <Button 
            variant="contained" 
            onClick={handleFilterApply}
            disabled={loading}
          >
            Apply Filter
          </Button>
          
          <Button 
            variant="outlined" 
            onClick={handleFilterReset}
            disabled={loading}
          >
            Reset
          </Button>
        </Box>
      </Paper>
      
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderBy === 'name' ? order : 'asc'}
                    onClick={() => handleRequestSort('name')}
                  >
                    Meal Name
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'dining_hall_id'}
                    direction={orderBy === 'dining_hall_id' ? order : 'asc'}
                    onClick={() => handleRequestSort('dining_hall_id')}
                  >
                    Dining Hall
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'protein'}
                    direction={orderBy === 'protein' ? order : 'asc'}
                    onClick={() => handleRequestSort('protein')}
                  >
                    Protein (g)
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'carbs'}
                    direction={orderBy === 'carbs' ? order : 'asc'}
                    onClick={() => handleRequestSort('carbs')}
                  >
                    Carbs (g)
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'fat'}
                    direction={orderBy === 'fat' ? order : 'asc'}
                    onClick={() => handleRequestSort('fat')}
                  >
                    Fat (g)
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'fiber'}
                    direction={orderBy === 'fiber' ? order : 'asc'}
                    onClick={() => handleRequestSort('fiber')}
                  >
                    Fiber (g)
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'calories'}
                    direction={orderBy === 'calories' ? order : 'asc'}
                    onClick={() => handleRequestSort('calories')}
                  >
                    Calories
                  </TableSortLabel>
                </TableCell>
                <TableCell>Serving Size</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedMeals.length > 0 ? (
                sortedMeals.map((meal) => (
                  <TableRow key={meal.id}>
                    <TableCell>{meal.name}</TableCell>
                    <TableCell>{meal.dining_hall?.name}</TableCell>
                    <TableCell>{meal.protein}</TableCell>
                    <TableCell>{meal.carbs}</TableCell>
                    <TableCell>{meal.fat}</TableCell>
                    <TableCell>{meal.fiber}</TableCell>
                    <TableCell>{meal.calories}</TableCell>
                    <TableCell>{meal.serving_size}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    No meals found matching the criteria
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
}; 