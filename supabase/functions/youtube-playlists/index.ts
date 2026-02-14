const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PlaylistItem {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
  position: number;
  channelTitle: string;
  duration?: string;
}

interface PlaylistInfo {
  playlistId: string;
  title: string;
  description: string;
  thumbnail: string;
  channelTitle: string;
  videoCount: number;
  videos: PlaylistItem[];
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, maxResults = 5 } = await req.json();

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = Deno.env.get('YOUTUBE_API_KEY');
    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: 'YouTube API key not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Search for playlists
    const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=playlist&q=${encodeURIComponent(query)}&maxResults=${maxResults}&key=${apiKey}`;
    const searchRes = await fetch(searchUrl);
    const searchData = await searchRes.json();

    if (!searchRes.ok) {
      console.error('YouTube search error:', searchData);
      return new Response(
        JSON.stringify({ error: searchData.error?.message || 'YouTube API error' }),
        { status: searchRes.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch details for each playlist
    const playlists: PlaylistInfo[] = [];

    for (const item of searchData.items || []) {
      const playlistId = item.id.playlistId;

      // Get playlist items (videos)
      const itemsUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&key=${apiKey}`;
      const itemsRes = await fetch(itemsUrl);
      const itemsData = await itemsRes.json();

      const videos: PlaylistItem[] = (itemsData.items || [])
        .filter((v: any) => v.snippet.resourceId.kind === 'youtube#video')
        .map((v: any) => ({
          videoId: v.snippet.resourceId.videoId,
          title: v.snippet.title,
          description: v.snippet.description,
          thumbnail: v.snippet.thumbnails?.medium?.url || v.snippet.thumbnails?.default?.url || '',
          position: v.snippet.position,
          channelTitle: v.snippet.channelTitle,
        }));

      playlists.push({
        playlistId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails?.medium?.url || item.snippet.thumbnails?.default?.url || '',
        channelTitle: item.snippet.channelTitle,
        videoCount: videos.length,
        videos,
      });
    }

    return new Response(
      JSON.stringify({ playlists }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
