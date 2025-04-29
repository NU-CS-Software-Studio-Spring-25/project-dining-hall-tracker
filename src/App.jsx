import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from '@mui/material';
import FoodItemsList from './components/FoodItemsList';
import FoodItemForm from './components/FoodItemForm';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Routes>
          <Route path="/" element={<FoodItemsList />} />
          <Route path="/food-items/new" element={<FoodItemForm />} />
          <Route path="/food-items/:id/edit" element={<FoodItemForm />} />
        </Routes>
      </Container>
    </Router>
  );
}

export default App;