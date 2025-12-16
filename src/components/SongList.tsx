import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Trash2, Music } from 'lucide-react';
import { Song } from '@/types/music';

interface SongListProps {
  songs: Song[];
  currentSong: Song | null;
  isPlaying: boolean;
  onPlaySong: (song: Song) => void;
  onRemoveSong: (id: string) => void;
}

export const SongList = ({
  songs,
  currentSong,
  isPlaying,
  onPlaySong,
  onRemoveSong,
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
              {/* Play indicator / button */}
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

              {/* Song info */}
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${isCurrent ? 'text-primary' : 'text-foreground'}`}>
                  {song.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {new Date(song.addedAt).toLocaleDateString()}
                </p>
              </div>

              {/* Delete button */}
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
