// In production, API calls are relative to the current origin
const isProduction = import.meta.env.PROD;

// If in production, use relative path; otherwise use development URL
const API_BASE_URL = isProduction 
  ? '/api/v1' 
  : (import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1');

// Helper function to get auth headers
const getAuthHeaders = () => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? {
    'Authorization': 'Bearer admin123'
  } : {};
};

export const api = {
  async checkHealth() {
    const response = await fetch(`${API_BASE_URL}/health`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw new Error('API health check failed');
    }
    return response.json();
  },

  async getDiningHalls() {
    const response = await fetch(`${API_BASE_URL}/dining_halls`);
    if (!response.ok) {
      throw new Error('Failed to fetch dining halls');
    }
    return response.json();
  },

  async getDiningHall(id: number) {
    const response = await fetch(`${API_BASE_URL}/dining_halls/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch dining hall with id ${id}`);
    }
    return response.json();
  },

  async getMeals(params: { nutrient?: string; amount?: number; dining_hall_id?: number } = {}) {
    // Build the query string from parameters
    const queryParams = new URLSearchParams();
    if (params.nutrient) queryParams.append('nutrient', params.nutrient);
    if (params.amount) queryParams.append('amount', params.amount.toString());
    if (params.dining_hall_id) queryParams.append('dining_hall_id', params.dining_hall_id.toString());
    
    const queryString = queryParams.toString();
    const url = `${API_BASE_URL}/meals${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch meals');
    }
    return response.json();
  },

  async getMeal(id: number) {
    const response = await fetch(`${API_BASE_URL}/meals/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch meal with id ${id}`);
    }
    return response.json();
  },

  async createMeal(mealData: Omit<import('../types').Meal, 'id' | 'dining_hall'>) {
    const response = await fetch(`${API_BASE_URL}/meals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ meal: mealData }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors ? errorData.errors.join(', ') : 'Failed to create meal');
    }
    return response.json();
  },

  async updateMeal(id: number, mealData: Partial<Omit<import('../types').Meal, 'id' | 'dining_hall'>>) {
    const response = await fetch(`${API_BASE_URL}/meals/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeaders()
      },
      body: JSON.stringify({ meal: mealData }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.errors ? errorData.errors.join(', ') : 'Failed to update meal');
    }
    return response.json();
  },

  async deleteMeal(id: number) {
    const response = await fetch(`${API_BASE_URL}/meals/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete meal');
    }
    return true;
  }
}; 