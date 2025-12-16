import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Song } from '@/types/music';
import { toast } from 'sonner';

interface DbSong {
  id: string;
  user_id: string;
  name: string;
  file_path: string;
  file_size: number | null;
  duration: number | null;
  created_at: string;
}

export const useSongStorage = (userId: string | undefined) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch songs from database
  const fetchSongs = useCallback(async () => {
    if (!userId) {
      setSongs([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('songs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Get signed URLs for each song
      const songsWithUrls: Song[] = await Promise.all(
        (data as DbSong[]).map(async (song) => {
          const { data: urlData } = await supabase.storage
            .from('songs')
            .createSignedUrl(song.file_path, 3600); // 1 hour expiry

          return {
            id: song.id,
            name: song.name,
            url: urlData?.signedUrl || '',
            duration: song.duration || 0,
            addedAt: new Date(song.created_at),
          };
        })
      );

      setSongs(songsWithUrls);
    } catch (error) {
      console.error('Error fetching songs:', error);
      toast.error('Failed to load your songs');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  // Upload a song
  const uploadSong = useCallback(async (file: File): Promise<Song | null> => {
    if (!userId) {
      toast.error('Please sign in to upload songs');
      return null;
    }

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;

      // Upload to storage
      const { error: uploadError } = await supabase.storage
        .from('songs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get signed URL
      const { data: urlData } = await supabase.storage
        .from('songs')
        .createSignedUrl(filePath, 3600);

      // Insert into database
      const songName = file.name.replace(/\.[^/.]+$/, '');
      const { data: songData, error: dbError } = await supabase
        .from('songs')
        .insert({
          user_id: userId,
          name: songName,
          file_path: filePath,
          file_size: file.size,
        })
        .select()
        .single();

      if (dbError) throw dbError;

      const newSong: Song = {
        id: songData.id,
        name: songData.name,
        url: urlData?.signedUrl || '',
        duration: 0,
        addedAt: new Date(songData.created_at),
      };

      setSongs(prev => [newSong, ...prev]);
      return newSong;
    } catch (error) {
      console.error('Error uploading song:', error);
      toast.error('Failed to upload song');
      return null;
    }
  }, [userId]);

  // Delete a song
  const deleteSong = useCallback(async (songId: string): Promise<boolean> => {
    if (!userId) return false;

    try {
      // Get file path first
      const { data: song, error: fetchError } = await supabase
        .from('songs')
        .select('file_path')
        .eq('id', songId)
        .single();

      if (fetchError) throw fetchError;

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from('songs')
        .remove([song.file_path]);

      if (storageError) {
        console.error('Storage delete error:', storageError);
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('songs')
        .delete()
        .eq('id', songId);

      if (dbError) throw dbError;

      setSongs(prev => prev.filter(s => s.id !== songId));
      return true;
    } catch (error) {
      console.error('Error deleting song:', error);
      toast.error('Failed to delete song');
      return false;
    }
  }, [userId]);

  return {
    songs,
    loading,
    uploadSong,
    deleteSong,
    refreshSongs: fetchSongs,
  };
};
