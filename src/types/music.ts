export interface Song {
  id: string;
  name: string;
  file?: File;
  url: string;
  duration: number;
  addedAt: Date;
  liked?: boolean;
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

export interface Playlist {
  id: string;
  name: string;
  songIds: string[];
  themeColor: string;
  createdAt: Date;
}

export const PLAYLIST_THEMES = [
  { name: 'Purple Haze', color: 'hsl(280, 100%, 65%)' },
  { name: 'Ocean Blue', color: 'hsl(200, 100%, 50%)' },
  { name: 'Sunset Orange', color: 'hsl(25, 100%, 55%)' },
  { name: 'Forest Green', color: 'hsl(145, 80%, 40%)' },
  { name: 'Rose Pink', color: 'hsl(340, 100%, 60%)' },
  { name: 'Golden Hour', color: 'hsl(45, 100%, 50%)' },
  { name: 'Midnight Blue', color: 'hsl(230, 80%, 45%)' },
  { name: 'Coral Reef', color: 'hsl(15, 100%, 60%)' },
];
