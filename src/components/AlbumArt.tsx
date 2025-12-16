import { motion } from 'framer-motion';
import { Music } from 'lucide-react';

interface AlbumArtProps {
  isPlaying: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const AlbumArt = ({ isPlaying, size = 'lg' }: AlbumArtProps) => {
  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-64 h-64',
  };

  const iconSizes = {
    sm: 20,
    md: 32,
    lg: 80,
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} rounded-2xl gradient-card glass flex items-center justify-center relative overflow-hidden`}
      animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
      transition={
        isPlaying
          ? { duration: 8, repeat: Infinity, ease: 'linear' }
          : { duration: 0.5 }
      }
    >
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20" />
      <Music size={iconSizes[size]} className="text-primary relative z-10" />
      
      {/* Spinning ring effect */}
      {size === 'lg' && (
        <div className="absolute inset-4 border-2 border-primary/30 rounded-full" />
      )}
    </motion.div>
  );
};
