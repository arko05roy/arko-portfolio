export type Track = { id: string; title: string; artist: string; preview: string };

const PLAYLIST_ID = "5nxWLpA12o6iJRu33w3JFF";
const FIRST_SONG = "when morning comes"; // the playlist always opens on this one

// Reads the playlist from Spotify's public embed page (no API key needed).
// Each track comes with a 30-second MP3 preview we can play in a plain <audio> element.
export async function getPlaylist(): Promise<Track[]> {
  try {
    const res = await fetch(`https://open.spotify.com/embed/playlist/${PLAYLIST_ID}`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      next: { revalidate: 86400 },
    });
    const html = await res.text();
    const json = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)?.[1];
    if (!json) return [];
    const list = JSON.parse(json).props.pageProps.state.data.entity.trackList as {
      uri: string; title: string; subtitle: string; isPlayable: boolean; audioPreview?: { url: string };
    }[];
    const tracks = list
      .filter((t) => t.isPlayable && t.audioPreview?.url)
      .map((t) => ({ id: t.uri.split(":")[2], title: t.title, artist: t.subtitle, preview: t.audioPreview!.url }));
    const start = Math.max(0, tracks.findIndex((t) => t.title.toLowerCase() === FIRST_SONG));
    return [...tracks.slice(start), ...tracks.slice(0, start)];
  } catch {
    return [];
  }
}
