import { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

function FoodItemsList() {
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    fetchFoodItems();
  }, []);

  const fetchFoodItems = async () => {
    try {
      const response = await axios.get('http://localhost:3000/food_items');
      setFoodItems(response.data);
    } catch (error) {
      console.error('Error fetching food items:', error);
    }
  };

  return (
    <div>
      <h1>Food Items</h1>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Protein (g)</TableCell>
              <TableCell>Dining Hall</TableCell>
              <TableCell>Meal Time</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {foodItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.protein}</TableCell>
                <TableCell>{item.dining_hall}</TableCell>
                <TableCell>{item.meal_time}</TableCell>
                <TableCell>
                  <Button
                    component={RouterLink}
                    to={`/food-items/${item.id}/edit`}
                    variant="contained"
                    color="primary"
                    size="small"
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default FoodItemsList;