import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import axios from 'axios';

function FoodItemForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [foodItem, setFoodItem] = useState({
    name: '',
    protein: '',
    dining_hall: '',
    meal_time: 'Breakfast'
  });

  useEffect(() => {
    if (id) {
      fetchFoodItem();
    }
  }, [id]);

  const fetchFoodItem = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/food_items/${id}`);
      setFoodItem(response.data);
    } catch (error) {
      console.error('Error fetching food item:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await axios.put(`http://localhost:3000/food_items/${id}`, foodItem);
      } else {
        await axios.post('http://localhost:3000/food_items', foodItem);
      }
      navigate('/');
    } catch (error) {
      console.error('Error saving food item:', error);
    }
  };

  const handleChange = (e) => {
    setFoodItem({
      ...foodItem,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4 }}>
      <h1>{id ? 'Edit Food Item' : 'New Food Item'}</h1>
      
      <TextField
        fullWidth
        label="Name"
        name="name"
        value={foodItem.name}
        onChange={handleChange}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Protein (g)"
        name="protein"
        type="number"
        value={foodItem.protein}
        onChange={handleChange}
        margin="normal"
        required
      />

      <TextField
        fullWidth
        label="Dining Hall"
        name="dining_hall"
        value={foodItem.dining_hall}
        onChange={handleChange}
        margin="normal"
        required
      />

      <FormControl fullWidth margin="normal">
        <InputLabel>Meal Time</InputLabel>
        <Select
          name="meal_time"
          value={foodItem.meal_time}
          onChange={handleChange}
          label="Meal Time"
        >
          <MenuItem value="Breakfast">Breakfast</MenuItem>
          <MenuItem value="Lunch">Lunch</MenuItem>
          <MenuItem value="Dinner">Dinner</MenuItem>
        </Select>
      </FormControl>

      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 2 }}
      >
        {id ? 'Update' : 'Create'} Food Item
      </Button>
    </Box>
  );
}

export default FoodItemForm;