/**
 * Utility functions for parsing and rendering YouTube video links and playlists.
 */

export interface YouTubeInfo {
  videoId: string;
  playlistId?: string;
  embedUrl: string;
  watchUrl: string;
}

export function parseYouTubeUrl(url: string | undefined): YouTubeInfo | null {
  if (!url || typeof url !== 'string') return null;

  try {
    const trimmed = url.trim();
    const parsed = new URL(trimmed);

    // Support youtube.com, m.youtube.com, youtu.be
    let videoId = '';
    let playlistId = parsed.searchParams.get('list') || undefined;

    if (parsed.hostname.includes('youtu.be')) {
      videoId = parsed.pathname.replace(/^\//, '').split('/')[0];
    } else if (parsed.hostname.includes('youtube.com')) {
      videoId = parsed.searchParams.get('v') || '';
      // Support /embed/ID
      if (!videoId && parsed.pathname.startsWith('/embed/')) {
        videoId = parsed.pathname.replace('/embed/', '').split('/')[0];
      }
    }

    if (!videoId) return null;

    let embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
    if (playlistId) {
      embedUrl += `?list=${encodeURIComponent(playlistId)}&rel=0`;
    } else {
      embedUrl += `?rel=0`;
    }

    return {
      videoId,
      playlistId,
      embedUrl,
      watchUrl: trimmed
    };
  } catch {
    return null;
  }
}
