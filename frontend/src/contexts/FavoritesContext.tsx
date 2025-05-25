import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface Favorite {
  id: number;
  meal_name: string;
  created_at: string;
}

interface FavoritesContextType {
  favorites: Favorite[];
  isLoading: boolean;
  addFavorite: (mealName: string) => Promise<void>;
  removeFavorite: (favoriteId: number) => Promise<void>;
  isFavorite: (mealName: string) => boolean;
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

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({ children }) => {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

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
      const response = await fetch('http://localhost:3000/api/v1/favorites', {
        credentials: 'include',
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
      const response = await fetch('http://localhost:3000/api/v1/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
      } else {
        throw new Error('Failed to add favorite');
      }
    } catch (error) {
      console.error('Add favorite error:', error);
      throw error;
    }
  };

  const removeFavorite = async (favoriteId: number) => {
    if (!user) return;

    try {
      const response = await fetch(`http://localhost:3000/api/v1/favorites/${favoriteId}`, {
        method: 'DELETE',
        credentials: 'include',
      });

      if (response.ok) {
        setFavorites((prev) => prev.filter((fav) => fav.id !== favoriteId));
      } else {
        throw new Error('Failed to remove favorite');
      }
    } catch (error) {
      console.error('Remove favorite error:', error);
      throw error;
    }
  };

  const isFavorite = (mealName: string): boolean => {
    return favorites.some((fav) => fav.meal_name === mealName);
  };

  const toggleFavorite = async (mealName: string) => {
    const existingFavorite = favorites.find((fav) => fav.meal_name === mealName);
    
    if (existingFavorite) {
      await removeFavorite(existingFavorite.id);
    } else {
      await addFavorite(mealName);
    }
  };

  const value = {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    refreshFavorites,
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};