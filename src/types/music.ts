export interface Song {
  id: string;
  name: string;
  file?: File;
  url: string;
  duration: number;
  addedAt: Date;
}

export interface Vibe {
  mood: string;
  energy: 'low' | 'medium' | 'high';
  color: string;
  description: string;
  emoji: string;
}

export interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
}
