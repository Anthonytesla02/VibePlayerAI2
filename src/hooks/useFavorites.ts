import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'vibeplay_favorites';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    return stored ? new Set(JSON.parse(stored)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify([...favorites]));
  }, [favorites]);

  const toggleFavorite = useCallback((songId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(songId)) {
        next.delete(songId);
      } else {
        next.add(songId);
      }
      return next;
    });
  }, []);

  const isFavorite = useCallback((songId: string) => {
    return favorites.has(songId);
  }, [favorites]);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
};
