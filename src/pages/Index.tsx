import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { MobileNav } from '@/components/MobileNav';
import { AlbumArt } from '@/components/AlbumArt';
import { WaveformVisualizer } from '@/components/WaveformVisualizer';
import { PlayerControls } from '@/components/PlayerControls';
import { SongList } from '@/components/SongList';
import { FileUpload } from '@/components/FileUpload';
import { VibeDetector } from '@/components/VibeDetector';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useSongStorage } from '@/hooks/useSongStorage';
import { useAuth } from '@/hooks/useAuth';
import { useSongLibrary } from '@/hooks/useSongLibrary';
import { Song } from '@/types/music';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Tab = 'player' | 'library' | 'vibe' | 'settings';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('player');
  const { user } = useAuth();
  const { playerState, playSong, togglePlay, seek, setVolume, stop } = useAudioPlayer();
  const { songs, loading, uploadSong, deleteSong } = useSongStorage(user?.id);
  const { playedSongs, markAsPlayed, clearPlayedSongs } = useSongLibrary();

  const handlePlaySong = (song: Song) => {
    playSong(song);
    markAsPlayed(song);
  };

  const handleFileUpload = async (file: File) => {
    const song = await uploadSong(file);
    if (song) {
      toast.success(`Added "${song.name}"`);
      // Auto-play if it's the first song
      if (songs.length === 0) {
        handlePlaySong(song);
      }
    }
  };

  const handleRemoveSong = async (id: string) => {
    if (playerState.currentSong?.id === id) {
      stop();
    }
    await deleteSong(id);
  };

  const pageVariants = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  return (
    <div className="min-h-screen bg-background gradient-vibe pb-24">
      <Header />

      <main className="px-4 max-w-md mx-auto">
        <AnimatePresence mode="wait">
          {activeTab === 'player' && (
            <motion.div
              key="player"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-8"
            >
              {/* Album Art */}
              <div className="flex flex-col items-center pt-8">
                <AlbumArt isPlaying={playerState.isPlaying} />
                
                {/* Waveform */}
                <div className="mt-6">
                  <WaveformVisualizer isPlaying={playerState.isPlaying} barCount={7} />
                </div>

                {/* Song Info */}
                <div className="mt-6 text-center">
                  <h2 className="text-xl font-bold text-foreground truncate max-w-[280px]">
                    {playerState.currentSong?.name || 'No song selected'}
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    {playerState.currentSong ? 'Now Playing' : 'Add music to start'}
                  </p>
                </div>
              </div>

              {/* Player Controls */}
              <PlayerControls
                playerState={playerState}
                songs={songs}
                onTogglePlay={togglePlay}
                onSeek={seek}
                onPlaySong={handlePlaySong}
                onVolumeChange={setVolume}
              />
            </motion.div>
          )}

          {activeTab === 'library' && (
            <motion.div
              key="library"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-4 py-4"
            >
              <h2 className="text-2xl font-bold text-foreground">Your Library</h2>
              <FileUpload onFileSelect={handleFileUpload} />
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <SongList
                  songs={songs}
                  currentSong={playerState.currentSong}
                  isPlaying={playerState.isPlaying}
                  onPlaySong={handlePlaySong}
                  onRemoveSong={handleRemoveSong}
                />
              )}
            </motion.div>
          )}

          {activeTab === 'vibe' && (
            <motion.div
              key="vibe"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-4 py-4"
            >
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gradient">Your Vibe</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  AI-powered mood detection
                </p>
              </div>
              <VibeDetector
                playedSongs={playedSongs}
                onClearHistory={clearPlayedSongs}
              />
              
              {/* Played songs history */}
              {playedSongs.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Recently played for analysis
                  </h3>
                  <div className="space-y-2">
                    {playedSongs.map((song) => (
                      <div
                        key={song.id}
                        className="flex items-center gap-3 p-2 rounded-lg bg-muted/30"
                      >
                        <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                          <span className="text-xs font-bold text-primary-foreground">
                            {playedSongs.indexOf(song) + 1}
                          </span>
                        </div>
                        <span className="text-sm text-foreground truncate">
                          {song.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
