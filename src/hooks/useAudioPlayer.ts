import { useState, useRef, useEffect, useCallback } from 'react';
import { Song, PlayerState } from '@/types/music';

export const useAudioPlayer = () => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playerState, setPlayerState] = useState<PlayerState>({
    currentSong: null,
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 0.7,
  });

  useEffect(() => {
    audioRef.current = new Audio();
    const audio = audioRef.current;

    audio.addEventListener('timeupdate', () => {
      setPlayerState(prev => ({ ...prev, currentTime: audio.currentTime }));
    });

    audio.addEventListener('loadedmetadata', () => {
      setPlayerState(prev => ({ ...prev, duration: audio.duration }));
    });

    audio.addEventListener('ended', () => {
      setPlayerState(prev => ({ ...prev, isPlaying: false, currentTime: 0 }));
    });

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const playSong = useCallback((song: Song) => {
    if (!audioRef.current) return;
    
    audioRef.current.src = song.url;
    audioRef.current.volume = playerState.volume;
    audioRef.current.play();
    
    setPlayerState(prev => ({
      ...prev,
      currentSong: song,
      isPlaying: true,
      currentTime: 0,
    }));
  }, [playerState.volume]);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !playerState.currentSong) return;

    if (playerState.isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    
    setPlayerState(prev => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, [playerState.isPlaying, playerState.currentSong]);

  const seek = useCallback((time: number) => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
    setPlayerState(prev => ({ ...prev, currentTime: time }));
  }, []);

  const setVolume = useCallback((volume: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume;
    setPlayerState(prev => ({ ...prev, volume }));
  }, []);

  const stop = useCallback(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setPlayerState(prev => ({
      ...prev,
      isPlaying: false,
      currentTime: 0,
    }));
  }, []);

  return {
    playerState,
    playSong,
    togglePlay,
    seek,
    setVolume,
    stop,
  };
};
