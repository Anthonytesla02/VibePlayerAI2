import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Switch } from '@/components/ui/switch';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export const ThemeToggle = ({ isDark, onToggle }: ThemeToggleProps) => {
  return (
    <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30">
      <div className="flex items-center gap-3">
        <motion.div
          animate={{ rotate: isDark ? 0 : 180 }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? (
            <Moon className="w-5 h-5 text-primary" />
          ) : (
            <Sun className="w-5 h-5 text-amber-500" />
          )}
        </motion.div>
        <div>
          <p className="font-medium text-foreground">Dark Mode</p>
          <p className="text-xs text-muted-foreground">
            {isDark ? 'Dark theme enabled' : 'Light theme enabled'}
          </p>
        </div>
      </div>
      <Switch checked={isDark} onCheckedChange={onToggle} />
    </div>
  );
};
