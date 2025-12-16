import { motion } from 'framer-motion';
import { Music2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export const Header = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    const { error } = await signOut();
    if (error) {
      toast.error('Failed to sign out');
    } else {
      toast.success('Signed out successfully');
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between p-4"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl gradient-primary shadow-glow">
          <Music2 size={24} className="text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gradient">VibePlay</h1>
          <p className="text-xs text-muted-foreground">AI-Powered Music</p>
        </div>
      </div>
      
      {user && (
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSignOut}
          className="text-muted-foreground hover:text-foreground"
        >
          <LogOut size={20} />
        </Button>
      )}
    </motion.header>
  );
};
