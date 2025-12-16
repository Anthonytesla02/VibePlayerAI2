import { motion } from 'framer-motion';
import { Sparkles, Zap, Moon, Sun, CloudRain, Heart } from 'lucide-react';
import { Vibe } from '@/types/music';

interface VibeCardProps {
  vibe: Vibe;
  isLoading?: boolean;
}

const vibeIcons: Record<string, React.ReactNode> = {
  energetic: <Zap size={32} />,
  calm: <Moon size={32} />,
  happy: <Sun size={32} />,
  melancholic: <CloudRain size={32} />,
  romantic: <Heart size={32} />,
  default: <Sparkles size={32} />,
};

export const VibeCard = ({ vibe, isLoading }: VibeCardProps) => {
  const icon = vibeIcons[vibe.mood.toLowerCase()] || vibeIcons.default;

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-6 rounded-2xl glass text-center"
      >
        <div className="flex justify-center mb-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Sparkles size={40} className="text-primary" />
          </motion.div>
        </div>
        <p className="text-lg font-medium text-foreground">Analyzing your vibe...</p>
        <p className="text-sm text-muted-foreground mt-1">
          Playing songs to understand your mood
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl glass border border-primary/20 shadow-glow"
    >
      <div className="flex items-center gap-4 mb-4">
        <div
          className="p-3 rounded-xl"
          style={{ backgroundColor: `${vibe.color}20` }}
        >
          <span style={{ color: vibe.color }}>{icon}</span>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-2xl">{vibe.emoji}</span>
            <h3 className="text-xl font-bold text-foreground">{vibe.mood}</h3>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary capitalize">
              {vibe.energy} energy
            </span>
          </div>
        </div>
      </div>
      <p className="text-muted-foreground">{vibe.description}</p>
    </motion.div>
  );
};
