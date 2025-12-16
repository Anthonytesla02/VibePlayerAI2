import { motion } from 'framer-motion';
import { Home, ListMusic, Sparkles, Settings } from 'lucide-react';

type Tab = 'player' | 'library' | 'vibe' | 'settings';

interface MobileNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs = [
  { id: 'player' as Tab, icon: Home, label: 'Player' },
  { id: 'library' as Tab, icon: ListMusic, label: 'Library' },
  { id: 'vibe' as Tab, icon: Sparkles, label: 'Vibe' },
];

export const MobileNav = ({ activeTab, onTabChange }: MobileNavProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 glass border-t border-border/50 px-6 py-2 pb-safe z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map(({ id, icon: Icon, label }) => {
          const isActive = activeTab === id;
          
          return (
            <motion.button
              key={id}
              whileTap={{ scale: 0.9 }}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center gap-1 p-2 min-w-[60px] transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div className="relative">
                <Icon size={24} />
                {isActive && (
                  <motion.div
                    layoutId="nav-indicator"
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary"
                  />
                )}
              </div>
              <span className="text-xs font-medium">{label}</span>
            </motion.button>
          );
        })}
      </div>
    </nav>
  );
};
