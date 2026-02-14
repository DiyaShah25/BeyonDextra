import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface YouTubeVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  position: number;
  channelTitle: string;
}

export interface YouTubePlaylist {
  playlistId: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  videoCount: number;
  videos: YouTubeVideo[];
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export function useYouTubePlaylists() {
  const [playlists, setPlaylists] = useState<YouTubePlaylist[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchPlaylists = async (query: string, maxResults = 5) => {
    setLoading(true);
    setError(null);

    try {
      const { data, error: fnError } = await supabase.functions.invoke('youtube-playlists', {
        body: { query, maxResults },
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      setPlaylists(data.playlists || []);
      return data.playlists || [];
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch playlists';
      setError(msg);
      console.error('YouTube search error:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const generateQuiz = async (videoTitle: string, videoDescription: string): Promise<QuizQuestion[]> => {
    try {
      const { data, error: fnError } = await supabase.functions.invoke('generate-video-quiz', {
        body: { videoTitle, videoDescription },
      });

      if (fnError) throw fnError;
      if (data.error) throw new Error(data.error);

      return data.questions || [];
    } catch (err) {
      console.error('Quiz generation error:', err);
      return [];
    }
  };

  return {
    playlists,
    loading,
    error,
    searchPlaylists,
    generateQuiz,
  };
}
