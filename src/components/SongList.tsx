import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Trash2, Music, Heart, Plus } from 'lucide-react';
import { Song, Playlist } from '@/types/music';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface SongListProps {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
  onRemoveSong: (id: string) => void;
  favorites?: Set<string>;
  onToggleFavorite?: (id: string) => void;
  playlists?: Playlist[];
  onAddToPlaylist?: (playlistId: string, songId: string) => void;
  showAddToPlaylist?: boolean;
}

export const SongList = ({
  songs,
  currentSong,
  isPlaying,
  onPlaySong,
  onRemoveSong,
  favorites,
  onToggleFavorite,
  playlists,
  onAddToPlaylist,
  showAddToPlaylist = true,
}: SongListProps) => {
  if (songs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <Music size={48} className="mb-4 opacity-50" />
        <p className="text-center">No songs yet</p>
        <p className="text-sm">Upload audio files to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {songs.map((song, index) => {
          const isCurrent = currentSong?.id === song.id;
          const isFavorite = favorites?.has(song.id);
          
          return (
            <motion.div
              key={song.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all cursor-pointer ${
                isCurrent
                  ? 'glass border border-primary/30'
                  : 'hover:bg-muted/50'
              }`}
              onClick={() => onPlaySong(song)}
            >
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  isCurrent ? 'gradient-primary' : 'bg-muted'
                }`}
              >
                {isCurrent && isPlaying ? (
                  <Pause size={18} className="text-primary-foreground" />
                ) : (
                  <Play size={18} className={isCurrent ? 'text-primary-foreground ml-0.5' : 'text-muted-foreground ml-0.5'} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${isCurrent ? 'text-primary' : 'text-foreground'}`}>
                  {song.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(song.addedAt).toLocaleDateString()}
                </p>
              </div>

              {onToggleFavorite && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(song.id);
                  }}
                  className={`p-2 rounded-lg transition-colors ${
                    isFavorite 
                      ? 'text-red-500 hover:bg-red-500/20' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'} />
                </motion.button>
              )}

              {showAddToPlaylist && playlists && playlists.length > 0 && onAddToPlaylist && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Plus size={18} />
                    </motion.button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      Add to playlist
                    </div>
                    <DropdownMenuSeparator />
                    {playlists.map((playlist) => (
                      <DropdownMenuItem
                        key={playlist.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToPlaylist(playlist.id, song.id);
                        }}
                        className="flex items-center gap-2"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: playlist.themeColor }}
                        />
                        {playlist.name}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onRemoveSong(song.id);
                }}
                className="p-2 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 size={18} />
              </motion.button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
