import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Song, Vibe } from '@/types/music';
import { VibeCard } from './VibeCard';
import { Button } from '@/components/ui/button';

interface VibeDetectorProps {
  playedSongs: Song[];
  onClearHistory: () => void;
}

// Simulated vibe detection (would use Gemini API in production)
const detectVibe = (songs: Song[]): Vibe => {
  const vibes: Vibe[] = [
    {
      mood: 'Energetic',
      energy: 'high',
      color: '#ff6b6b',
      description: 'Your music choices suggest you\'re feeling pumped and ready to take on the world! Time to channel that energy into something amazing.',
      emoji: '⚡',
    },
    {
      mood: 'Calm',
      energy: 'low',
      color: '#4ecdc4',
      description: 'You seem to be in a peaceful, reflective state. Perfect for deep thinking or just enjoying the moment.',
      emoji: '🌊',
    },
    {
      mood: 'Happy',
      energy: 'high',
      color: '#ffe66d',
      description: 'Joy radiates from your music selection! You\'re in a great mood and it shows in every beat.',
      emoji: '☀️',
    },
    {
      mood: 'Melancholic',
      energy: 'low',
      color: '#6c5ce7',
      description: 'There\'s a beautiful depth to your current mood. Sometimes the most meaningful moments come from quiet reflection.',
      emoji: '🌧️',
    },
    {
      mood: 'Romantic',
      energy: 'medium',
      color: '#fd79a8',
      description: 'Love is in the air! Your music choices reveal a heart that\'s open and full of feeling.',
      emoji: '💕',
    },
  ];

  // Simple random selection (would be AI-powered in production)
  return vibes[Math.floor(Math.random() * vibes.length)];
};

export const VibeDetector = ({ playedSongs, onClearHistory }: VibeDetectorProps) => {
  const [vibe, setVibe] = useState<Vibe | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const songsNeeded = 2;
  const canDetect = playedSongs.length >= songsNeeded;
  const songsRemaining = Math.max(0, songsNeeded - playedSongs.length);

  useEffect(() => {
    if (playedSongs.length === songsNeeded && !vibe) {
      analyzeVibe();
    }
  }, [playedSongs.length]);

  const analyzeVibe = async () => {
    setIsAnalyzing(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const detectedVibe = detectVibe(playedSongs);
    setVibe(detectedVibe);
    setIsAnalyzing(false);
  };

  const handleReanalyze = () => {
    setVibe(null);
    onClearHistory();
  };

  if (isAnalyzing) {
    return <VibeCard vibe={{ mood: '', energy: 'medium', color: '', description: '', emoji: '' }} isLoading />;
  }

  if (vibe) {
    return (
      <div className="space-y-4">
        <VibeCard vibe={vibe} />
        <Button
          onClick={handleReanalyze}
          variant="outline"
          className="w-full gap-2"
        >
          <RefreshCw size={18} />
          Detect New Vibe
        </Button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 rounded-2xl glass text-center border border-dashed border-muted-foreground/20"
    >
      <div className="flex justify-center mb-4">
        <div className="p-4 rounded-2xl bg-muted/50">
          <Sparkles size={32} className="text-primary" />
        </div>
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">Vibe Detection</h3>
      <p className="text-muted-foreground text-sm">
        {songsRemaining > 0
          ? `Play ${songsRemaining} more song${songsRemaining > 1 ? 's' : ''} to detect your vibe`
          : 'Analyzing your musical taste...'}
      </p>
      
      {/* Progress indicator */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: songsNeeded }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${
              i < playedSongs.length ? 'gradient-primary' : 'bg-muted'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
};
