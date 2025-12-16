import { useState, useEffect, useCallback } from 'react';
import { Playlist, PLAYLIST_THEMES } from '@/types/music';

const PLAYLISTS_KEY = 'vibeplay_playlists';

export const usePlaylists = () => {
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const stored = localStorage.getItem(PLAYLISTS_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((p: Playlist) => ({
        ...p,
        createdAt: new Date(p.createdAt),
      }));
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem(PLAYLISTS_KEY, JSON.stringify(playlists));
  }, [playlists]);

  const getNextTheme = useCallback(() => {
    const usedColors = new Set(playlists.map(p => p.themeColor));
    const availableTheme = PLAYLIST_THEMES.find(t => !usedColors.has(t.color));
    return availableTheme || PLAYLIST_THEMES[playlists.length % PLAYLIST_THEMES.length];
  }, [playlists]);

  const createPlaylist = useCallback((name: string): Playlist => {
    const theme = getNextTheme();
    const playlist: Playlist = {
      id: crypto.randomUUID(),
      name,
      songIds: [],
      themeColor: theme.color,
      createdAt: new Date(),
    };
    setPlaylists(prev => [...prev, playlist]);
    return playlist;
  }, [getNextTheme]);

  const deletePlaylist = useCallback((id: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
  }, []);

  const addSongToPlaylist = useCallback((playlistId: string, songId: string) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId && !p.songIds.includes(songId)) {
        return { ...p, songIds: [...p.songIds, songId] };
      }
      return p;
    }));
  }, []);

  const removeSongFromPlaylist = useCallback((playlistId: string, songId: string) => {
    setPlaylists(prev => prev.map(p => {
      if (p.id === playlistId) {
        return { ...p, songIds: p.songIds.filter(id => id !== songId) };
      }
      return p;
    }));
  }, []);

  const renamePlaylist = useCallback((id: string, name: string) => {
    setPlaylists(prev => prev.map(p => p.id === id ? { ...p, name } : p));
  }, []);

  return {
    playlists,
    createPlaylist,
    deletePlaylist,
    addSongToPlaylist,
    removeSongFromPlaylist,
    renamePlaylist,
  };
};
