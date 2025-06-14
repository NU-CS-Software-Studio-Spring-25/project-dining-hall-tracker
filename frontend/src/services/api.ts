// In production, API calls are relative to the current origin
const isProduction = import.meta.env.PROD;

// If in production, use relative path; otherwise use development URL
const API_BASE_URL = isProduction 
  ? '/api/v1' 
  : (import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1');

// Helper function to get common headers
const getHeaders = (): Record<string, string> => {
  return {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
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

  async syncDiningData() {
    const response = await fetch(`${API_BASE_URL}/dining_halls/sync`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getHeaders()
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to sync dining data');
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
        ...getHeaders()
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
        ...getHeaders()
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
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete meal');
    }
    return true;
  },

  async downloadMeals() {
    const response = await fetch(`${API_BASE_URL}/meals/download`, {
      method: 'GET',
      headers: getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Failed to download meals');
    }
    
    // Get the blob from the response
    const blob = await response.blob();
    
    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = 'meals.json';
    
    // Append to body, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL
    window.URL.revokeObjectURL(url);
  }
}; 