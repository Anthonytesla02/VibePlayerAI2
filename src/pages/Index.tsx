import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from '@/components/Header';
import { MobileNav } from '@/components/MobileNav';
import { AlbumArt } from '@/components/AlbumArt';
import { WaveformVisualizer } from '@/components/WaveformVisualizer';
import { PlayerControls } from '@/components/PlayerControls';
import { SongList } from '@/components/SongList';
import { FileUpload } from '@/components/FileUpload';
import { YouTubeImport } from '@/components/YouTubeImport';
import { VibeDetector } from '@/components/VibeDetector';
import { SearchBar } from '@/components/SearchBar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { PlaylistManager } from '@/components/PlaylistManager';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useSongStorage } from '@/hooks/useSongStorage';
import { useAuth } from '@/hooks/useAuth';
import { useSongLibrary } from '@/hooks/useSongLibrary';
import { useFavorites } from '@/hooks/useFavorites';
import { usePlaylists } from '@/hooks/usePlaylists';
import { useTheme } from '@/hooks/useTheme';
import { Song } from '@/types/music';
import { Loader2, Play, Music } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

type Tab = 'player' | 'library' | 'favorites' | 'vibe' | 'settings';

const Index = () => {
  const [activeTab, setActiveTab] = useState<Tab>('player');
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const { playerState, playSong, togglePlay, seek, setVolume, stop, playQueue } = useAudioPlayer();
  const { songs, loading, uploadSong, deleteSong } = useSongStorage(user?.id);
  const { playedSongs, markAsPlayed, clearPlayedSongs } = useSongLibrary();
  const { favorites, toggleFavorite, isFavorite } = useFavorites();
  const { playlists, createPlaylist, deletePlaylist, addSongToPlaylist, removeSongFromPlaylist, renamePlaylist } = usePlaylists();
  const { isDark, toggleTheme } = useTheme();

  const handlePlaySong = (song: Song) => {
    playSong(song);
    markAsPlayed(song);
  };

  const handleFileUpload = async (file: File) => {
    const song = await uploadSong(file);
    if (song) {
      toast.success(`Added "${song.name}"`);
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

  const handlePlayAll = (songIds: string[]) => {
    const songsToPlay = songIds
      .map(id => songs.find(s => s.id === id))
      .filter(Boolean) as Song[];
    
    if (songsToPlay.length > 0) {
      playQueue(songsToPlay);
      songsToPlay.forEach(song => markAsPlayed(song));
      toast.success(`Playing ${songsToPlay.length} songs`);
    }
  };

  const handlePlayFavorites = () => {
    const favoriteSongs = songs.filter(s => favorites.has(s.id));
    if (favoriteSongs.length > 0) {
      playQueue(favoriteSongs);
      favoriteSongs.forEach(song => markAsPlayed(song));
      toast.success(`Playing ${favoriteSongs.length} favorites`);
    }
  };

  const handleAddToPlaylist = (playlistId: string, songId: string) => {
    addSongToPlaylist(playlistId, songId);
    const playlist = playlists.find(p => p.id === playlistId);
    toast.success(`Added to ${playlist?.name}`);
  };

  const filteredSongs = useMemo(() => {
    if (!searchQuery.trim()) return songs;
    const query = searchQuery.toLowerCase();
    return songs.filter(song => song.name.toLowerCase().includes(query));
  }, [songs, searchQuery]);

  const favoriteSongs = useMemo(() => {
    return songs.filter(s => favorites.has(s.id));
  }, [songs, favorites]);

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
              <div className="flex flex-col items-center pt-8">
                <AlbumArt isPlaying={playerState.isPlaying} />
                
                <div className="mt-6">
                  <WaveformVisualizer isPlaying={playerState.isPlaying} barCount={7} />
                </div>

                <div className="mt-6 text-center">
                  <h2 className="text-xl font-bold text-foreground truncate max-w-[280px]">
                    {playerState.currentSong?.name || 'No song selected'}
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    {playerState.currentSong ? 'Now Playing' : 'Add music to start'}
                  </p>
                </div>
              </div>

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
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search songs..."
              />
              <div className="space-y-2">
                <FileUpload onFileSelect={handleFileUpload} />
                <YouTubeImport onImport={handleFileUpload} />
              </div>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : (
                <SongList
                  songs={filteredSongs}
                  currentSong={playerState.currentSong}
                  isPlaying={playerState.isPlaying}
                  onPlaySong={handlePlaySong}
                  onRemoveSong={handleRemoveSong}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  playlists={playlists}
                  onAddToPlaylist={handleAddToPlaylist}
                />
              )}
            </motion.div>
          )}

          {activeTab === 'favorites' && (
            <motion.div
              key="favorites"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-4 py-4"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-foreground">Favorites</h2>
                {favoriteSongs.length > 0 && (
                  <Button
                    onClick={handlePlayFavorites}
                    className="gradient-button"
                    size="sm"
                  >
                    <Play size={16} className="mr-1" />
                    Play All
                  </Button>
                )}
              </div>

              {favoriteSongs.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                  <Music size={48} className="mb-4 opacity-50" />
                  <p className="text-center">No favorites yet</p>
                  <p className="text-sm">Tap the heart icon on songs to add them</p>
                </div>
              ) : (
                <SongList
                  songs={favoriteSongs}
                  currentSong={playerState.currentSong}
                  isPlaying={playerState.isPlaying}
                  onPlaySong={handlePlaySong}
                  onRemoveSong={handleRemoveSong}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                  playlists={playlists}
                  onAddToPlaylist={handleAddToPlaylist}
                />
              )}

              <div className="pt-4">
                <PlaylistManager
                  playlists={playlists}
                  songs={songs}
                  onCreatePlaylist={createPlaylist}
                  onDeletePlaylist={deletePlaylist}
                  onRenamePlaylist={renamePlaylist}
                  onPlayAll={handlePlayAll}
                  onRemoveSongFromPlaylist={removeSongFromPlaylist}
                />
              </div>
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

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              variants={pageVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="space-y-4 py-4"
            >
              <h2 className="text-2xl font-bold text-foreground">Settings</h2>
              
              <div className="space-y-4">
                <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
                
                <div className="p-4 rounded-xl bg-muted/30">
                  <p className="font-medium text-foreground">Account</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {user?.email || 'Not signed in'}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-muted/30">
                  <p className="font-medium text-foreground">Library Stats</p>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="text-2xl font-bold text-primary">{songs.length}</p>
                      <p className="text-xs text-muted-foreground">Songs</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-accent">{favoriteSongs.length}</p>
                      <p className="text-xs text-muted-foreground">Favorites</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-secondary">{playlists.length}</p>
                      <p className="text-xs text-muted-foreground">Playlists</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-foreground">{playedSongs.length}</p>
                      <p className="text-xs text-muted-foreground">Played</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <MobileNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;
