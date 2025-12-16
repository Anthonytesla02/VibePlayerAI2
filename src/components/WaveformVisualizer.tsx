import { motion } from 'framer-motion';

interface WaveformVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
}

export const WaveformVisualizer = ({ isPlaying, barCount = 5 }: WaveformVisualizerProps) => {
  return (
    <div className="flex items-end justify-center gap-1 h-8">
      {Array.from({ length: barCount }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full gradient-primary"
          initial={{ height: '20%' }}
          animate={
            isPlaying
              ? {
                  height: ['20%', '100%', '60%', '100%', '20%'],
                }
              : { height: '20%' }
          }
          transition={
            isPlaying
              ? {
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.1,
                  ease: 'easeInOut',
                }
              : { duration: 0.3 }
          }
        />
      ))}
    </div>
  );
};
