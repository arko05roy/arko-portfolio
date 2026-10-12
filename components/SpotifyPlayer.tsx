"use client";

import { useEffect, useRef, useState } from "react";
import type { Track } from "@/lib/spotify";
import { pulse } from "@/lib/pulse";

// "Now playing" strip at the top of the home page, styled like the rest of the engraved/bone theme.
// Plays 30s previews in order through a plain <audio> element. Browsers block sound until the
// visitor interacts, so if the autoplay attempt is refused it starts on their first click/tap/key.
export default function SpotifyPlayer({ tracks }: { tracks: Track[] }) {
  const audio = useRef<HTMLAudioElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [time, setTime] = useState(0);
  const [covers, setCovers] = useState<Record<string, string>>({});
  const track = tracks[i];

  // Feed the galaxy: an analyser on the <audio> element (previews are served with CORS headers).
  const graph = useRef<{ ctx: AudioContext; an: AnalyserNode; buf: Uint8Array<ArrayBuffer> } | null>(null);
  const connect = () => {
    const el = audio.current;
    if (!el || graph.current) { graph.current?.ctx.resume(); return; }
    try {
      const ctx = new AudioContext();
      const an = ctx.createAnalyser();
      an.fftSize = 256; an.smoothingTimeConstant = .8;
      ctx.createMediaElementSource(el).connect(an);
      an.connect(ctx.destination);
      graph.current = { ctx, an, buf: new Uint8Array(an.frequencyBinCount) };
    } catch {}
  };
  // Autoplay, falling back to the first user gesture.
  useEffect(() => {
    const a = audio.current;
    if (!a) return;
    const events = ["pointerdown", "keydown", "touchend"];
    const start = (e: Event) => {
      // even if autoplay already worked, the visualizer can only be wired up inside a gesture
      connect();
      off();
      if (card.current?.contains(e.target as Node)) return; // the widget's own button handles play
      a.play().catch(() => {});
    };
    const off = () => events.forEach((ev) => removeEventListener(ev, start, true));
    events.forEach((ev) => addEventListener(ev, start, true));
    a.play().catch(() => {});
    return off;
  }, []);

  useEffect(() => {
    pulse.read = () => {
      const g = graph.current;
      if (!g || !pulse.playing) { pulse.bass = pulse.level = 0; pulse.bins.fill(0); return; }
      g.an.getByteFrequencyData(g.buf);
      // first 64 of 128 bins hold nearly all musical energy; sqrt lifts the quieter highs
      for (let k = 0; k < 64; k++) pulse.bins[k] = Math.sqrt(g.buf[k] / 255);
      let lo = 0, all = 0;
      for (let k = 0; k < g.buf.length; k++) { all += g.buf[k]; if (k < 8) lo += g.buf[k]; }
      pulse.bass = lo / (8 * 255);
      pulse.level = all / (g.buf.length * 255);
    };
    return () => { pulse.read = null; pulse.playing = false; pulse.cover = null; graph.current?.ctx.close(); };
  }, []);

  useEffect(() => {
    const url = track && covers[track.id];
    if (!url) return;
    const img = new Image();
    img.onload = () => { pulse.cover = img; };
    img.src = url;
  }, [track, covers]);

  // Album art for the current track (oEmbed allows cross-origin requests).
  useEffect(() => {
    if (!track || covers[track.id]) return;
    fetch(`https://open.spotify.com/oembed?url=https://open.spotify.com/track/${track.id}`)
      .then((r) => r.json())
      .then((d) => d.thumbnail_url && setCovers((c) => ({ ...c, [track.id]: d.thumbnail_url })))
      .catch(() => {});
  }, [track, covers]);

  // Moving to another song keeps playing if music was on (or the previous song just ended).
  const resume = useRef(false);
  useEffect(() => {
    if (resume.current) audio.current?.play().catch(() => {});
  }, [i]);
  const next = () => {
    resume.current = playing || !!audio.current?.ended;
    setProgress(0);
    setI((n) => (n + 1) % tracks.length);
  };
  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    connect();
    if (a.paused) a.play().catch(() => {}); else a.pause();
  };

  const fmt = (t: number) => `${Math.floor(t / 60)}:${String(Math.floor(t % 60)).padStart(2, "0")}`;
  const cover = track && covers[track.id];

  return (
    <div ref={card} className={`np container enter ${playing ? "is-playing" : ""}`} style={{ ["--i" as string]: 0 }}>
      {track && (
        <audio
          ref={audio}
          src={track.preview}
          preload="auto"
          crossOrigin="anonymous"
          onPlay={() => { pulse.playing = true; setPlaying(true); }}
          onPause={() => { pulse.playing = false; setPlaying(false); }}
          onEnded={next}
          onError={next}
          onTimeUpdate={(e) => {
            setTime(e.currentTarget.currentTime);
            setProgress(e.currentTarget.currentTime / (e.currentTarget.duration || 30));
          }}
        />
      )}
      <div className="np-card">
        <div className="np-art">{cover && <img src={cover} alt="" width={44} height={44} />}</div>
        <div className="np-meta">
          <span className="np-eyebrow mono">
            <span className="np-eq" aria-hidden="true"><i /><i /><i /></span>
            {track ? `${playing ? "Now playing" : "Paused"} · ${String(i + 1).padStart(2, "0")}/${String(tracks.length).padStart(2, "0")}` : "Offline"}
          </span>
          {track ? (
            <a className="np-title" href={`https://open.spotify.com/track/${track.id}`} target="_blank" rel="noreferrer">
              {track.title} <span className="np-artist">— {track.artist}</span>
            </a>
          ) : (
            <span className="np-title np-error">Unable to reach Spotify right now.</span>
          )}
        </div>
        <span className="np-time mono">{fmt(time)}</span>
        <div className="np-controls">
          <button className="np-btn" onClick={toggle} disabled={!track} aria-label={playing ? "Pause" : "Play"}>
            {playing ? (
              <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><rect x="6" y="5" width="4" height="14" /><rect x="14" y="5" width="4" height="14" /></svg>
            ) : (
              <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M7 4.5v15l13-7.5z" /></svg>
            )}
          </button>
          <button className="np-btn" onClick={next} disabled={!track} aria-label="Next song">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M4 4.5v15l11-7.5zM16 4.5h3v15h-3z" /></svg>
          </button>
        </div>
        <span className="np-bar" aria-hidden="true"><span style={{ transform: `scaleX(${progress})` }} /></span>
      </div>
    </div>
  );
}
