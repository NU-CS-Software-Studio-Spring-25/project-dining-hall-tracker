const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

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
}; 