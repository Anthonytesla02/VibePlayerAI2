import { motion } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { PlayerState, Song } from '@/types/music';

interface PlayerControlsProps {
  playerState: PlayerState;
  songs: Song[];
  onTogglePlay: () => void;
  onSeek: (time: number) => void;
  onPlaySong: (song: Song) => void;
  onVolumeChange: (volume: number) => void;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

export const PlayerControls = ({
  playerState,
  songs,
  onTogglePlay,
  onSeek,
  onPlaySong,
  onVolumeChange,
}: PlayerControlsProps) => {
  const { currentSong, isPlaying, currentTime, duration, volume } = playerState;

  const currentIndex = currentSong ? songs.findIndex(s => s.id === currentSong.id) : -1;

  const handlePrevious = () => {
    if (currentIndex > 0) {
      onPlaySong(songs[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (currentIndex < songs.length - 1) {
      onPlaySong(songs[currentIndex + 1]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Progress Bar */}
      <div className="space-y-2">
        <Slider
          value={[currentTime]}
          max={duration || 100}
          step={0.1}
          onValueChange={([value]) => onSeek(value)}
          className="cursor-pointer"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handlePrevious}
          disabled={currentIndex <= 0}
          className="p-3 rounded-full glass text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
        >
          <SkipBack size={24} />
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onTogglePlay}
          disabled={!currentSong}
          className="p-5 rounded-full gradient-button shadow-glow disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {isPlaying ? (
            <Pause size={32} className="text-primary-foreground" />
          ) : (
            <Play size={32} className="text-primary-foreground ml-1" />
          )}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleNext}
          disabled={currentIndex >= songs.length - 1 || currentIndex === -1}
          className="p-3 rounded-full glass text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-opacity"
        >
          <SkipForward size={24} />
        </motion.button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center gap-3 px-4">
        <Volume2 size={18} className="text-muted-foreground" />
        <Slider
          value={[volume * 100]}
          max={100}
          step={1}
          onValueChange={([value]) => onVolumeChange(value / 100)}
          className="cursor-pointer"
        />
      </div>
    </div>
  );
};
