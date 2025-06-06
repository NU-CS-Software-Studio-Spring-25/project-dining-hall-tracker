import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

interface User {
  id: number;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, passwordConfirmation: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Use the correct API URL based on environment
      const apiUrl = import.meta.env.PROD 
        ? '/api/v1/auth/me' 
        : 'http://localhost:3000/api/v1/auth/me';
        
      const response = await fetch(apiUrl, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const userData = await response.json();
        setUser(userData.user);
      } else if (response.status === 401) {
        // User not authenticated, this is normal
        setUser(null);
      } else {
        console.warn('Auth check failed with status:', response.status);
        setUser(null);
      }
    } catch (error) {
      console.warn('Auth check failed (this is normal on first visit):', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Use the correct Devise sign-in endpoint
      const apiUrl = import.meta.env.PROD 
        ? '/users/sign_in' 
        : 'http://localhost:3000/users/sign_in';
        
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          user: {
            email,
            password,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        let errorMessage = 'Login failed';
        try {
          const data = await response.json();
          errorMessage = data.message || errorMessage;
        } catch {
          // If JSON parsing fails, use default error message
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      const apiUrl = import.meta.env.PROD 
        ? '/users/sign_out' 
        : 'http://localhost:3000/users/sign_out';
        
      await fetch(apiUrl, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });
      
      setUser(null);
      
      // Also clear any admin localStorage state
      localStorage.removeItem('isAuthenticated');
    } catch (error) {
      console.error('Logout error:', error);
      setUser(null);
      // Clear local state even if logout request fails
      localStorage.removeItem('isAuthenticated');
    }
  };

  const signup = async (email: string, password: string, passwordConfirmation: string) => {
    setIsLoading(true);
    try {
      const apiUrl = import.meta.env.PROD 
        ? '/users' 
        : 'http://localhost:3000/users';
        
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          user: {
            email,
            password,
            password_confirmation: passwordConfirmation,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        let errorMessage = 'Signup failed';
        try {
          const data = await response.json();
          errorMessage = data.errors?.join(', ') || data.message || errorMessage;
        } catch {
          // If JSON parsing fails, use default error message
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    user,
    isLoading,
    login,
    logout,
    signup,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};