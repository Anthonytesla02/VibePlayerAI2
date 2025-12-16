import { useState, useCallback } from 'react';
import { Song } from '@/types/music';

export const useSongLibrary = () => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [playedSongs, setPlayedSongs] = useState<Song[]>([]);

  const addSong = useCallback((file: File): Song => {
    const url = URL.createObjectURL(file);
    const song: Song = {
      id: crypto.randomUUID(),
      name: file.name.replace(/\.[^/.]+$/, ''),
      file,
      url,
      duration: 0,
      addedAt: new Date(),
    };
    
    setSongs(prev => [...prev, song]);
    return song;
  }, []);

  const removeSong = useCallback((id: string) => {
    setSongs(prev => {
      const song = prev.find(s => s.id === id);
      if (song) {
        URL.revokeObjectURL(song.url);
      }
      return prev.filter(s => s.id !== id);
    });
  }, []);

  const markAsPlayed = useCallback((song: Song) => {
    setPlayedSongs(prev => {
      if (prev.find(s => s.id === song.id)) return prev;
      return [...prev, song];
    });
  }, []);

  const clearPlayedSongs = useCallback(() => {
    setPlayedSongs([]);
  }, []);

  return {
    songs,
    playedSongs,
    addSong,
    removeSong,
    markAsPlayed,
    clearPlayedSongs,
  };
};
