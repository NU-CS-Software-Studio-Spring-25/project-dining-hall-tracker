// In production, API calls are relative to the current origin
const isProduction = import.meta.env.PROD;

// If in production, use relative path; otherwise use development URL
const API_BASE_URL = isProduction 
  ? '/api/v1' 
  : (import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1');

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