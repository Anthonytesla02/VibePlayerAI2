import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, Link, Loader2, Music, Download, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface VideoInfo {
  title: string;
  author: string;
  lengthSeconds: string;
  thumbnail: string;
  videoId: string;
}

interface YouTubeImportProps {
  onImport: (file: File) => Promise<void>;
}

const getApiBase = () => {
  const origin = window.location.origin;
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
    return origin.replace(':5000', ':3001');
  }
  if (origin.includes(':5000')) {
    return origin.replace(':5000', ':3001');
  }
  return `${origin.replace(/:\d+$/, '')}:3001`;
};

const API_BASE = getApiBase();

export const YouTubeImport = ({ onImport }: YouTubeImportProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
  const [downloading, setDownloading] = useState(false);

  const fetchVideoInfo = async () => {
    if (!url.trim()) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    setLoading(true);
    setVideoInfo(null);

    try {
      const response = await fetch(`${API_BASE}/api/youtube/info?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch video info');
      }

      setVideoInfo(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fetch video info');
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: string) => {
    const sec = parseInt(seconds);
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownloadAndImport = async () => {
    if (!videoInfo) return;

    setDownloading(true);
    try {
      toast.info('Extracting audio from YouTube...');
      
      const response = await fetch(`${API_BASE}/api/youtube/audio?url=${encodeURIComponent(url)}`);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to download audio');
      }

      const blob = await response.blob();
      const fileName = `${videoInfo.title.replace(/[^\w\s-]/g, '').trim()}.mp3`;
      const file = new File([blob], fileName, { type: 'audio/mpeg' });

      await onImport(file);
      
      toast.success(`Imported "${videoInfo.title}"`);
      setIsOpen(false);
      setUrl('');
      setVideoInfo(null);
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to import audio');
    } finally {
      setDownloading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setUrl('');
    setVideoInfo(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full p-4 rounded-xl glass border border-dashed border-red-500/30 hover:border-red-500/60 transition-colors flex items-center justify-center gap-3 text-muted-foreground hover:text-foreground"
        >
          <div className="p-2 rounded-lg bg-red-500">
            <Youtube size={20} className="text-white" />
          </div>
          <span className="font-medium">Import from YouTube</span>
        </motion.button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Youtube className="text-red-500" size={24} />
            Import from YouTube
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Paste YouTube URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && fetchVideoInfo()}
              className="flex-1"
            />
            <Button onClick={fetchVideoInfo} disabled={loading}>
              {loading ? <Loader2 className="animate-spin" size={18} /> : <Link size={18} />}
            </Button>
          </div>

          <AnimatePresence mode="wait">
            {videoInfo && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-4 rounded-xl bg-muted/50 space-y-3"
              >
                <div className="flex gap-3">
                  {videoInfo.thumbnail && (
                    <img
                      src={videoInfo.thumbnail}
                      alt={videoInfo.title}
                      className="w-24 h-16 object-cover rounded-lg"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">{videoInfo.title}</p>
                    <p className="text-sm text-muted-foreground">{videoInfo.author}</p>
                    <p className="text-xs text-muted-foreground">
                      Duration: {formatDuration(videoInfo.lengthSeconds)}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleDownloadAndImport}
                  disabled={downloading}
                  className="w-full gradient-button"
                >
                  {downloading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" size={18} />
                      Extracting Audio...
                    </>
                  ) : (
                    <>
                      <Download size={18} className="mr-2" />
                      Extract Audio & Import
                    </>
                  )}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="text-xs text-muted-foreground text-center">
            Paste a YouTube video URL to extract and import the audio
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
