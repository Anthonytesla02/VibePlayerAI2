import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Play, ChevronRight, Music, Edit2, Check, X } from 'lucide-react';
import { Playlist, Song } from '@/types/music';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface PlaylistManagerProps {
  playlists: Playlist[];
  songs: Song[];
  onCreatePlaylist: (name: string) => void;
  onDeletePlaylist: (id: string) => void;
  onRenamePlaylist: (id: string, name: string) => void;
  onPlayAll: (songIds: string[]) => void;
  onRemoveSongFromPlaylist: (playlistId: string, songId: string) => void;
}

export const PlaylistManager = ({
  playlists,
  songs,
  onCreatePlaylist,
  onDeletePlaylist,
  onRenamePlaylist,
  onPlayAll,
  onRemoveSongFromPlaylist,
}: PlaylistManagerProps) => {
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [expandedPlaylist, setExpandedPlaylist] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const handleCreate = () => {
    if (newPlaylistName.trim()) {
      onCreatePlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setDialogOpen(false);
    }
  };

  const getSongsForPlaylist = (songIds: string[]) => {
    return songIds.map(id => songs.find(s => s.id === id)).filter(Boolean) as Song[];
  };

  const startEditing = (playlist: Playlist) => {
    setEditingId(playlist.id);
    setEditName(playlist.name);
  };

  const saveEdit = (id: string) => {
    if (editName.trim()) {
      onRenamePlaylist(id, editName.trim());
    }
    setEditingId(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Your Playlists</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gradient-button">
              <Plus size={16} className="mr-1" />
              New
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Playlist</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Input
                placeholder="Playlist name"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
              <Button onClick={handleCreate} className="w-full gradient-button">
                Create Playlist
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {playlists.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
          <Music size={40} className="mb-3 opacity-50" />
          <p className="text-sm">No playlists yet</p>
          <p className="text-xs">Create one to organize your music</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {playlists.map((playlist) => {
              const playlistSongs = getSongsForPlaylist(playlist.songIds);
              const isExpanded = expandedPlaylist === playlist.id;
              const isEditing = editingId === playlist.id;

              return (
                <motion.div
                  key={playlist.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="rounded-xl overflow-hidden"
                  style={{ 
                    background: `linear-gradient(135deg, ${playlist.themeColor}15 0%, ${playlist.themeColor}05 100%)`,
                    border: `1px solid ${playlist.themeColor}30`
                  }}
                >
                  <div
                    className="flex items-center gap-3 p-3 cursor-pointer"
                    onClick={() => setExpandedPlaylist(isExpanded ? null : playlist.id)}
                  >
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                      style={{ backgroundColor: playlist.themeColor }}
                    >
                      <Music size={18} className="text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="h-7 text-sm"
                            autoFocus
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') saveEdit(playlist.id);
                              if (e.key === 'Escape') setEditingId(null);
                            }}
                          />
                          <button onClick={() => saveEdit(playlist.id)} className="text-green-500">
                            <Check size={16} />
                          </button>
                          <button onClick={() => setEditingId(null)} className="text-muted-foreground">
                            <X size={16} />
                          </button>
                        </div>
                      ) : (
                        <>
                          <p className="font-medium text-foreground truncate">{playlist.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {playlistSongs.length} song{playlistSongs.length !== 1 ? 's' : ''}
                          </p>
                        </>
                      )}
                    </div>

                    {!isEditing && (
                      <>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            startEditing(playlist);
                          }}
                          className="p-2 rounded-lg hover:bg-muted/50 text-muted-foreground"
                        >
                          <Edit2 size={16} />
                        </motion.button>

                        {playlistSongs.length > 0 && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              onPlayAll(playlist.songIds);
                            }}
                            className="p-2 rounded-lg text-primary hover:bg-primary/20"
                          >
                            <Play size={18} />
                          </motion.button>
                        )}

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeletePlaylist(playlist.id);
                          }}
                          className="p-2 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 size={16} />
                        </motion.button>

                        <motion.div
                          animate={{ rotate: isExpanded ? 90 : 0 }}
                          className="text-muted-foreground"
                        >
                          <ChevronRight size={18} />
                        </motion.div>
                      </>
                    )}
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="px-3 pb-3 space-y-1">
                          {playlistSongs.length === 0 ? (
                            <p className="text-xs text-muted-foreground text-center py-2">
                              No songs in this playlist
                            </p>
                          ) : (
                            playlistSongs.map((song) => (
                              <div
                                key={song.id}
                                className="flex items-center gap-2 p-2 rounded-lg bg-background/50"
                              >
                                <Music size={14} className="text-muted-foreground shrink-0" />
                                <span className="text-sm text-foreground truncate flex-1">
                                  {song.name}
                                </span>
                                <button
                                  onClick={() => onRemoveSongFromPlaylist(playlist.id, song.id)}
                                  className="text-muted-foreground hover:text-destructive"
                                >
                                  <X size={14} />
                                </button>
                              </div>
                            ))
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
