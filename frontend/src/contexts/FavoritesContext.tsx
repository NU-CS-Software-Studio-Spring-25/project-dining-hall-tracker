import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useNotification } from './NotificationContext';

interface Favorite {
  id: number;
  meal_name: string;
  created_at: string;
}

interface FavoritesContextType {
  favorites: Favorite[];
  isLoading: boolean;
  isFavorite: (mealName: string) => boolean;
  addFavorite: (mealName: string) => Promise<void>;
  removeFavorite: (mealName: string) => Promise<void>;
  toggleFavorite: (mealName: string) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

// Get the base URL for API calls
const getBaseUrl = () => {
  if (import.meta.env.PROD) {
    // In production, use relative URLs (same domain as the app)
    return '';
  } else {
    // In development, use localhost
    return 'http://localhost:3000';
  }
};

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { showSuccess, showError } = useNotification();

  useEffect(() => {
    if (user) {
      refreshFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const refreshFavorites = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/v1/favorites`, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites(data);
      }
    } catch (error) {
      console.error('Failed to fetch favorites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addFavorite = async (mealName: string) => {
    if (!user) return;

    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/v1/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          favorite: {
            meal_name: mealName,
          },
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setFavorites((prev) => [...prev, data.favorite]);
        showSuccess(`Added "${mealName}" to favorites!`);
      } else {
        throw new Error('Failed to add favorite');
      }
    } catch (error) {
      console.error('Add favorite error:', error);
      showError(`Failed to add "${mealName}" to favorites. Please try again.`);
      throw error;
    }
  };

  const removeFavorite = async (mealName: string) => {
    if (!user) return;

    const favorite = favorites.find((f) => f.meal_name === mealName);
    if (!favorite) return;

    try {
      const baseUrl = getBaseUrl();
      const response = await fetch(`${baseUrl}/api/v1/favorites/${favorite.id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        setFavorites((prev) => prev.filter((f) => f.id !== favorite.id));
        showSuccess(`Removed "${mealName}" from favorites!`);
      } else {
        throw new Error('Failed to remove favorite');
      }
    } catch (error) {
      console.error('Remove favorite error:', error);
      showError(`Failed to remove "${mealName}" from favorites. Please try again.`);
      throw error;
    }
  };

  const isFavorite = (mealName: string) => {
    return favorites.some((favorite) => favorite.meal_name === mealName);
  };

  const toggleFavorite = async (mealName: string) => {
    if (isFavorite(mealName)) {
      await removeFavorite(mealName);
    } else {
      await addFavorite(mealName);
    }
  };

  const value = {
    favorites,
    isLoading,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    refreshFavorites,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};