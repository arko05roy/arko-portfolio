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
    // pointerdown is NOT a user activation for touch in Chrome, so unlock on events that are;
    // only stop listening once sound actually starts, so a refused attempt can retry next gesture.
    const events = ["pointerup", "click", "keydown", "touchend"];
    const start = (e: Event) => {
      // even if autoplay already worked, the visualizer can only be wired up inside a gesture
      connect();
      if (card.current?.contains(e.target as Node)) { off(); return; } // the widget's own button handles play
      if (!a.paused) { off(); return; }
      a.play().then(off, () => {});
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
  // Previous restarts the song if we're more than 3s in, like every other player.
  const prev = () => {
    const a = audio.current;
    if (a && a.currentTime > 3) { a.currentTime = 0; return; }
    resume.current = playing;
    setProgress(0);
    setI((n) => (n - 1 + tracks.length) % tracks.length);
  };
  const [dur, setDur] = useState(30);
  const seekTo = (frac: number) => {
    const a = audio.current;
    if (!a) return;
    const f = Math.min(1, Math.max(0, frac));
    a.currentTime = f * (a.duration || 30);
    setProgress(f);
  };
  const seekFrom = (e: React.PointerEvent<HTMLDivElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    seekTo((e.clientX - r.left) / r.width);
  };

  // Lock screen / headphone / media-key controls.
  const ctl = useRef({ toggle: () => {}, next: () => {}, prev: () => {} });
  useEffect(() => {
    if (!("mediaSession" in navigator)) return;
    const ms = navigator.mediaSession;
    ms.setActionHandler("play", () => ctl.current.toggle());
    ms.setActionHandler("pause", () => ctl.current.toggle());
    ms.setActionHandler("nexttrack", () => ctl.current.next());
    ms.setActionHandler("previoustrack", () => ctl.current.prev());
    return () => (["play", "pause", "nexttrack", "previoustrack"] as const).forEach((a) => ms.setActionHandler(a, null));
  }, []);
  useEffect(() => {
    if (!track || !("mediaSession" in navigator)) return;
    const art = covers[track.id];
    navigator.mediaSession.metadata = new MediaMetadata({
      title: track.title, artist: track.artist, artwork: art ? [{ src: art, sizes: "300x300" }] : [],
    });
  }, [track, covers]);

  const toggle = () => {
    const a = audio.current;
    if (!a) return;
    connect();
    if (a.paused) a.play().catch(() => {}); else a.pause();
  };

  ctl.current = { toggle, next, prev };

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
          onPlay={() => {
            // once routed through Web Audio, a suspended context means silent playback
            graph.current?.ctx.resume().catch(() => {});
            pulse.playing = true; setPlaying(true);
          }}
          onPause={() => { pulse.playing = false; setPlaying(false); }}
          onEnded={next}
          onError={next}
          onLoadedMetadata={(e) => setDur(e.currentTarget.duration || 30)}
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
        <span className="np-time mono">{fmt(time)} <span className="np-dur">/ {fmt(dur)}</span></span>
        <div className="np-controls">
          <button className="np-btn" onClick={prev} disabled={!track} aria-label="Previous song">
            <svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M20 4.5v15L9 12zM5 4.5h3v15H5z" /></svg>
          </button>
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
        <div
          className="np-bar"
          role="slider"
          tabIndex={track ? 0 : -1}
          aria-label="Seek"
          aria-valuemin={0}
          aria-valuemax={Math.round(dur)}
          aria-valuenow={Math.round(time)}
          aria-valuetext={`${fmt(time)} of ${fmt(dur)}`}
          onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); seekFrom(e); }}
          onPointerMove={(e) => { if (e.currentTarget.hasPointerCapture(e.pointerId)) seekFrom(e); }}
          onKeyDown={(e) => {
            const step = e.key === "ArrowRight" ? 5 : e.key === "ArrowLeft" ? -5 : 0;
            if (!step) return;
            e.preventDefault();
            seekTo((time + step) / dur);
          }}
        >
          <span style={{ transform: `scaleX(${progress})` }} />
        </div>
      </div>
    </div>
  );
}
