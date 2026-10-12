"use client";

import { useEffect, useRef } from "react";
import { pulse } from "@/lib/pulse";

type Dot = { x: number; y: number; r: number; a: number; z: number; tw: number };
type P = { x: number; y: number; r: number; a: number };
type V3 = { x: number; y: number; z: number; s: number; r: number };
type Burst = { x: number; y: number; z: number; R: number; ph: number; spin: number; pts: V3[] };
type Meteor = { x: number; y: number; vx: number; vy: number; life: number };
type Grain = { u: number; off: number; r: number; a: number; spd: number; len: number; w: number };
type Disc = { ang: number; rad: number; r: number; a: number; spd: number; off: number };

// Stippled night sky: drifting dust, a streaming comet, a milky-way band and a rotating galaxy disc.
// Mouse tilts the layers (parallax) and pushes nearby stars; scroll sinks the sky.
export default function Cosmos() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, dpr = 1, raf = 0;
    let stars: Dot[] = [], band: Dot[] = [], disc: Disc[] = [];
    const m = { x: 0, y: 0, tx: 0, ty: 0, px: -9999, py: -9999 };
    let sy = 0, maxS = 1;
    // scene pieces are stippled once (relative to their centre) and only translated per frame
    let MS = 1, coma: P[] = [], moon: P[] = [], moonTrail: P[] = [], tail: Grain[] = [], planet: P[] = [], saturn: P[] = [], clouds: P[] = [], ridge: P[] = [];
    let bursts: Burst[] = [], meteors: Meteor[] = [];

    const rnd = (a: number, b: number) => a + Math.random() * (b - a);
    const gauss = () => (Math.random() + Math.random() + Math.random() - 1.5) / 1.5;

    const build = () => {
      dpr = Math.min(2, devicePixelRatio || 1);
      w = innerWidth; h = innerHeight;
      cv.width = w * dpr; cv.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const area = (w * h) / 1e6;
      stars = Array.from({ length: Math.round(520 * area) + 120 }, () => ({
        x: Math.random() * w, y: Math.random() * h * 1.6,
        r: Math.random() < .06 ? rnd(1, 1.8) : rnd(.3, .9),
        a: rnd(.25, .95), z: rnd(.2, 1), tw: Math.random() * 6.28,
      }));
      // diagonal milky-way band, dense in the middle like stipple engraving
      band = Array.from({ length: Math.round(1400 * area) + 300 }, () => {
        const t = Math.random();
        const spread = gauss() * (w < 700 ? 70 : 120) * (0.6 + Math.sin(t * 9) * 0.25);
        return {
          x: w * (0.62 - t * 0.35) + spread, y: t * h * 1.4 - h * 0.1 + spread * 0.3,
          r: rnd(.3, 1.1), a: rnd(.15, .7) * (1 - Math.abs(spread) / 200), z: .35, tw: Math.random() * 6.28,
        };
      });
      const S = Math.min(w, 1100) / 1100 + .25;

      // comet: dense stippled coma; tail grains stream along a curved path (animated per frame)
      const cr = 14 * S, tl = 300 * S;
      coma = [];
      for (let i = 0; i < 520; i++) { const a = Math.random() * 6.28, d = Math.pow(Math.random(), 1.8) * cr * 2.4; coma.push({ x: Math.cos(a) * d, y: Math.sin(a) * d, r: rnd(.4, 1.1), a: Math.max(.15, 1 - d / (cr * 2.4)) }); }
      tail = Array.from({ length: 1600 }, () => ({ u: Math.random(), off: gauss(), r: rnd(.35, 1), a: rnd(.4, 1), spd: rnd(.7, 1.3), len: tl, w: cr }));
      // crescent planet: lit limb from the upper right, faint dotted night side
      const pr = 170 * S; planet = [];
      for (let i = 0; i < 5200; i++) {
        const a = Math.random() * 6.28, d = Math.sqrt(Math.random());
        const x = Math.cos(a) * d, y = Math.sin(a) * d, z = Math.sqrt(1 - d * d);
        const lit = x * .55 - y * .62 + z * .2;
        const crater = Math.sin(x * 23 + y * 7) * Math.sin(y * 19 - x * 5) > .55 ? .45 : 1;
        if (lit > 0 && Math.random() < Math.pow(lit, .7) * crater) planet.push({ x: x * pr, y: y * pr, r: rnd(.4, 1.1), a: .35 + lit * .65 });
        else if (d > .82 && Math.random() < .5) planet.push({ x: x * pr, y: y * pr, r: .6, a: .18 });
        else if (Math.random() < .035) planet.push({ x: x * pr, y: y * pr, r: .5, a: .12 });
      }

      // ringed planet
      const kr = 22 * S; saturn = [];
      for (let i = 0; i < 500; i++) {
        const a = Math.random() * 6.28, d = Math.sqrt(Math.random()), x = Math.cos(a) * d, y = Math.sin(a) * d;
        if (Math.random() < .25 + (x - y) * .4 || d > .9) saturn.push({ x: x * kr, y: y * kr, r: rnd(.4, 1), a: rnd(.5, 1) });
      }
      for (const [rr, n] of [[1.8, 260], [2.15, 320], [2.5, 200]] as const)
        for (let i = 0; i < n; i++) {
          const a = (i / n) * 6.28, x = Math.cos(a) * rr * kr, y = Math.sin(a) * rr * kr * .28;
          if (y < 0 && Math.abs(x) < kr * .95) continue; // ring passes behind the planet
          const c = Math.cos(-.6), s2 = Math.sin(-.6);
          saturn.push({ x: x * c - y * s2, y: x * s2 + y * c, r: rnd(.5, 1.2), a: rnd(.5, 1) });
        }

      // billowing clouds: stacked lobes, stipple dense on each lobe's upper rim
      clouds = [];
      const lobes = Array.from({ length: 9 }, (_, i) => ({ x: (i - 4) * 70 * S + rnd(-20, 20), y: -i * 28 * S + Math.abs(i - 4) * 22 * S, r: rnd(60, 95) * S }));
      for (const L of lobes) for (let i = 0; i < 900; i++) {
        const a = rnd(Math.PI * 1.05, Math.PI * 1.95), d = Math.pow(Math.random(), .35) * L.r;
        const x = L.x + Math.cos(a) * d, y = L.y + Math.sin(a) * d;
        const rim = d / L.r;
        if (Math.random() < Math.pow(rim, 3)) clouds.push({ x, y, r: rnd(.4, 1), a: .2 + rim * .55 });
      }

      // ridge rising to the right with contour striations (bottom of the page)
      ridge = [];
      for (let i = 0; i < Math.round(9000 * (w / 1400)) + 2500; i++) {
        const x = Math.random() * w, top = h * (.95 - (x / w) * .38) + Math.sin(x * .013) * 18 + Math.sin(x * .041) * 7;
        const dep = Math.pow(Math.random(), 1.6) * h * .5, y = top + dep;
        const stripe = .5 + .5 * Math.sin(dep * .09 + x * .02 + Math.sin(x * .007) * 3);
        if (Math.random() < (1 - dep / (h * .5)) * (.35 + .65 * stripe)) ridge.push({ x, y, r: rnd(.4, 1.2), a: .25 + .75 * (1 - dep / (h * .5)) });
      }

      // crescent moon: thin lit sliver on the left limb, craters thin the stipple, faint earthshine on the rest
      MS = S; const mr = 48 * S; moon = [];
      for (let i = 0; i < 4200; i++) {
        const a = Math.random() * 6.28, d = Math.sqrt(Math.random()), x = Math.cos(a) * d, y = Math.sin(a) * d;
        // terminator: a second disc offset to the right carves the crescent out
        const inShadow = (x - .42) ** 2 + (y + .08) ** 2 < .92;
        const crater = Math.sin(x * 17 + 1) * Math.sin(y * 13 - 2) > .6 ? .5 : 1;
        if (!inShadow) { if (Math.random() < .9 * crater) moon.push({ x: x * mr, y: y * mr, r: rnd(.4, 1.1), a: .5 + .5 * Math.min(1, -x + .2) }); }
        else if (d > .94 && Math.random() < .35) moon.push({ x: x * mr, y: y * mr, r: .5, a: .22 });
        else if (Math.random() < .03) moon.push({ x: x * mr, y: y * mr, r: .45, a: .12 });
      }

      moonTrail = Array.from({ length: 220 }, () => ({ x: Math.pow(Math.random(), 1.4), y: gauss(), r: rnd(.35, .9), a: rnd(.25, .8) }));

      // wobbling particle membranes: layered shells of points on a noisy sphere
      bursts = [
        { x: .14, y: 1.2, z: .7, R: 70 },
        { x: .18, y: 2.8, z: .65, R: 60 },
      ].map((b) => {
        const pts: V3[] = [];
        for (const [shell, n] of [[1, 1300], [.93, 700], [.84, 350]] as const)
          for (let i = 0; i < n; i++) {
            const y = 1 - (2 * (i + .5)) / n, rr = Math.sqrt(1 - y * y), a = i * 2.39996;
            pts.push({ x: Math.cos(a) * rr, y, z: Math.sin(a) * rr, s: shell, r: rnd(.35, 1) });
          }
        // a sparse dusting inside
        for (let i = 0; i < 260; i++) { const a = Math.random() * 6.28, c = rnd(-1, 1), q = Math.sqrt(1 - c * c); pts.push({ x: Math.cos(a) * q, y: c, z: Math.sin(a) * q, s: Math.cbrt(Math.random()) * .75, r: rnd(.3, .7) }); }
        return { ...b, R: b.R * S, ph: Math.random() * 100, spin: 0, pts };
      });
      maxS = Math.max(1, document.documentElement.scrollHeight - h);

      disc = Array.from({ length: 1700 }, () => {
        const core = Math.random() < .35;
        return {
          ang: Math.random() * 6.28,
          rad: core ? Math.abs(gauss()) * .25 : Math.pow(Math.random(), .7),
          r: rnd(.35, 1.3), a: rnd(.35, 1), spd: rnd(.6, 1.4), off: gauss() * .05,
        };
      });
    };

    // music: the galaxy orbits the current song — spins faster while playing, breathes with the bass
    let spinA = 0, lastT = 0, eBass = 0, eLvl = 0, eOn = 0, coverRot = 0;

    // smoothed spectrum, sampled by angle around the ring: lows at the left/right, highs top/bottom
    const spec = new Float32Array(64);
    const freq = (ang: number) => {
      const u = Math.abs((((ang / 6.283) % 1) + 1) % 1 * 2 - 1); // 0..1..0 around the circle
      return spec[Math.min(63, Math.floor(u * 64))];
    };

    const draw = (t: number) => {
      const dt = Math.min(64, t - lastT || 16); lastT = t;
      pulse.read?.();
      eOn += ((pulse.playing ? 1 : 0) - eOn) * .03;
      eBass += (pulse.bass - eBass) * (pulse.bass > eBass ? .35 : .08);
      eLvl += (pulse.level - eLvl) * .1;
      spinA += dt / 26000 * (1 + eOn * 3 + eBass * 10);
      coverRot += dt / 9000 * eOn;
      for (let k = 0; k < 64; k++) spec[k] += (pulse.bins[k] - spec[k]) * (pulse.bins[k] > spec[k] ? .5 : .12);
      m.x += (m.tx - m.x) * .06; m.y += (m.ty - m.y) * .06;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = "#ece6da";

      for (const layer of [stars, band]) for (const s of layer) {
        const dx = m.x * 30 * s.z, dy = m.y * 30 * s.z - sy * s.z * .45;
        let x = s.x + dx, y = ((s.y + dy) % (h * 1.6) + h * 1.6) % (h * 1.6) - h * .3;
        const ex = x - m.px, ey = y - m.py, d2 = ex * ex + ey * ey;
        if (d2 < 14400) { const f = (1 - d2 / 14400) * 18; const d = Math.sqrt(d2) || 1; x += ex / d * f; y += ey / d * f; }
        if (y < -4 || y > h + 4) continue;
        ctx.globalAlpha = s.a * (still ? 1 : .7 + .3 * Math.sin(t / 900 + s.tw));
        ctx.beginPath(); ctx.arc(x, y, s.r, 0, 6.283); ctx.fill();
      }

      // galaxy disc: tilted ellipse, fades and drifts up as you scroll away from the hero
      const fade = Math.max(0, 1 - sy / (h * .9));
      if (fade > 0) {
        const R = Math.min(w * .42, 330) * (1 + eBass * .06), cx = w * .5 + m.x * 18, cy = h * .3 - sy * .5 + m.y * 18;
        const tilt = .16 + m.y * .05, rot = -.12 + m.x * .06, spin = still ? 0 : spinA;
        const cr = Math.cos(rot), sr = Math.sin(rot);
        for (const p of disc) {
          const a = p.ang + spin * p.spd / (p.rad + .3);
          const ex = Math.cos(a) * p.rad * R, ey = (Math.sin(a) * p.rad * tilt + p.off) * R;
          // the disc is the visualizer: each particle's angle picks a frequency band (mirrored so the
          // ring is symmetric), and that band's energy pushes it outward
          const kick = 1 + freq(a) * .22 * eOn * (.4 + p.rad);
          ctx.globalAlpha = Math.min(1, p.a * fade * (p.rad < .2 ? 1 : .75) * (1 + eLvl * 1.2));
          ctx.beginPath(); ctx.arc(cx + ex * kick * cr - ey * sr, cy + ex * kick * sr + ey * cr, p.r * (1 + eBass * .5), 0, 6.283); ctx.fill();
        }
        const core = R * .22 * (1 + eBass * .45);
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, core);
        g.addColorStop(0, "#fffaf0"); g.addColorStop(.25, "#ece6da99"); g.addColorStop(1, "#ece6da00");
        ctx.globalAlpha = fade; ctx.fillStyle = g;
        ctx.beginPath(); ctx.arc(cx, cy, core, 0, 6.283); ctx.fill();
        // radial spectrum: stippled spokes around the core in the disc's tilted plane, the classic
        // circular visualizer (polar bars) drawn as dots so it reads like the rest of the engraving
        if (eOn > .01 && !still) {
          const N = 96, base = R * .16, rings = [1, 1.9];
          ctx.fillStyle = "#ece6da";
          for (const ring of rings) {
            for (let k = 0; k < N; k++) {
              const ang = k / N * 6.283 + spin * (ring === 1 ? 1 : -.6);
              const v = freq(ang), len = v * R * (ring === 1 ? .22 : .12);
              const ca = Math.cos(ang), sa = Math.sin(ang);
              for (let d = 0; d <= len; d += 3) {
                const rr = base * ring + d, ex = ca * rr, ey = sa * rr * tilt;
                ctx.globalAlpha = fade * eOn * (1 - d / (len + 1)) * (ring === 1 ? .85 : .5);
                ctx.fillRect(cx + ex * cr - ey * sr - .6, cy + ex * sr + ey * cr - .6, 1.2, 1.2);
              }
            }
          }
          ctx.globalAlpha = 1;
        }
        // the song's album art sits in the eye of the galaxy, turning like a record
        if (pulse.cover && eOn > .01) {
          const r = R * .085 * (1 + eBass * .15);
          ctx.save();
          ctx.globalAlpha = fade * eOn;
          ctx.translate(cx, cy); ctx.rotate(coverRot);
          ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.283); ctx.clip();
          ctx.filter = "grayscale(.35) contrast(1.1)";
          ctx.drawImage(pulse.cover, -r, -r, r * 2, r * 2);
          ctx.filter = "none";
          ctx.globalAlpha = fade * eOn * .9; ctx.fillStyle = "#0b0d0e";
          ctx.beginPath(); ctx.arc(0, 0, r * .12, 0, 6.283); ctx.fill();
          ctx.restore();
          ctx.globalAlpha = fade * eOn * (.35 + eBass * .5); ctx.strokeStyle = "#ece6da"; ctx.lineWidth = 1;
          ctx.beginPath(); ctx.arc(cx, cy, r + 3, 0, 6.283); ctx.stroke();
          ctx.fillStyle = "#ece6da";
        }
        // vertical jet
        ctx.fillStyle = "#ece6da";
        for (let i = -60; i <= 60; i++) {
          const k = i / 60, jx = cx + k * R * .08 * -sr * 6, jy = cy + k * R * .75;
          ctx.globalAlpha = fade * (1 - Math.abs(k)) * .55;
          ctx.fillRect(jx + Math.sin(i * 7.1) * 1.5, jy, 1, 1);
        }
      }
      ctx.fillStyle = "#ece6da";
      // world-anchored pieces: screen y = base * h - scroll * depth, nudged by the mouse
      const dots = (pts: P[], cx: number, cy: number, k = 1, scale = 1) => {
        for (const p of pts) { ctx.globalAlpha = p.a * k; ctx.fillRect(cx + p.x * scale - p.r, cy + p.y * scale - p.r, p.r * 2, p.r * 2); }
      };
      const at = (bx: number, by: number, z: number) => [bx * w + m.x * 40 * z, by * h - sy * z + m.y * 40 * z] as const;
      const vis = (y: number, pad: number) => y > -pad && y < h + pad;

      { const [x, y] = at(.78, .98, .5); if (vis(y, 340)) {
        // tail sweeps up-right and bends; grains flow outward and widen/fade with distance
        const sway = still ? 0 : Math.sin(t / 3000) * .08;
        for (const g of tail) {
          const u = still ? g.u : (g.u + t * .00004 * g.spd) % 1, L = u * g.len;
          const ang = 2.4 + sway - u * .5;
          const nx = -Math.sin(ang), ny = Math.cos(ang), sp = g.off * g.w * (.4 + u * 3.2);
          ctx.globalAlpha = g.a * Math.pow(1 - u, 1.4);
          ctx.fillRect(x - Math.cos(ang) * L + nx * sp, y - Math.sin(ang) * L + ny * sp, g.r * 2, g.r * 2);
        }
        dots(coma, x, y, 1, 1 + (still ? 0 : Math.sin(t / 900) * .04));
      } }
      { const [x, y] = at(.16, 1.75, .45); if (vis(y, 260)) dots(planet, x, y); }
      { const [x, y] = at(.84, 2.35, .62); if (vis(y, 80)) { ctx.save(); ctx.translate(x, y); ctx.rotate(still ? 0 : Math.sin(t / 4000) * .06); dots(saturn, 0, 0); ctx.restore(); } }
      { const [x, y] = at(.3, 3.2, .38); if (vis(y, 400)) dots(clouds, x + (still ? 0 : Math.sin(t / 7000) * 14), y); }
      { const [x, y] = at(.85, 3.9, .38); if (vis(y, 400)) dots(clouds, x, y, .6, .7); }

      { const [bx, by] = at(.86, 2.0, .8); if (vis(by, 200)) {
        // glides back and forth along the shooting-star diagonal, shedding a stippled dust trail
        const T = still ? 0 : t / 6000, k = Math.sin(T), v = Math.cos(T);
        const dx = -.86, dy = .5, span = 70 * MS;
        const x = bx + dx * k * span, y = by + dy * k * span;
        const dir = v >= 0 ? 1 : -1, speed = Math.abs(v);
        for (const p of moonTrail) {
          const d = p.x * 140 * MS * (.3 + speed), o = p.y * 20 * MS * (.4 + p.x);
          ctx.globalAlpha = p.a * speed * (1 - p.x);
          ctx.fillRect(x - dx * dir * (d + 30 * MS) - dy * o, y - dy * dir * (d + 30 * MS) + dx * o, p.r * 2, p.r * 2);
        }
        const near = Math.hypot(x - m.px, y - m.py) < 120;
        ctx.save(); ctx.translate(x, y); ctx.rotate(-.35 + (still ? 0 : Math.sin(t / 5000) * .08));
        dots(moon, 0, 0, near ? 1 : .85); ctx.restore();
      } }

      for (const b of bursts) {
        const [cx, cy] = at(b.x, b.y, b.z);
        if (!vis(cy, b.R * 2)) continue;
        const near = Math.hypot(cx - m.px, cy - m.py) < b.R * 2;
        b.spin += ((near ? 1 : 0) - b.spin) * .05;
        const T = still ? b.ph : b.ph + t / 1000;
        const ry = T * .25 + m.x * .8, rx = .4 + Math.sin(T * .13) * .3 + m.y * .6;
        const cY = Math.cos(ry), sY = Math.sin(ry), cX = Math.cos(rx), sX = Math.sin(rx);
        const amp = .1 + b.spin * .12;
        for (const p of b.pts) {
          // folds: displacement from a few travelling waves over the sphere's direction
          const n = Math.sin(p.x * 3.1 + T * .7) * Math.sin(p.y * 2.7 - T * .5) + .6 * Math.sin(p.z * 4.3 + p.x * 2 + T * .9);
          const k = p.s * (1 + amp * n) * b.R;
          const x1 = p.x * cY + p.z * sY, z1 = -p.x * sY + p.z * cY;
          const y2 = p.y * cX - z1 * sX, z2 = p.y * sX + z1 * cX;
          // rim glow: points seen edge-on are brightest, back side dimmer
          const rim = 1 - Math.abs(z2), f = z2 > 0 ? .8 : .4;
          ctx.globalAlpha = Math.min(1, (p.s < .8 ? .35 : .15 + Math.pow(rim, 2.5) * .85) * f);
          const r = p.r * (1 + z2 * .3);
          ctx.fillRect(cx + x1 * k - r, cy + y2 * k - r, r * 2, r * 2);
        }
      }

      // ridge rises from below as you reach the end of the page
      const lift = (1 - sy / maxS) * h * .9;
      if (lift < h * .6) dots(ridge, m.x * 12, lift, 1);

      // shooting stars
      if (!still && Math.random() < .0015) meteors.push({ x: rnd(.2, 1) * w, y: rnd(0, .4) * h, vx: -rnd(7, 11), vy: rnd(3, 5), life: 1 });
      meteors = meteors.filter((k) => (k.life -= .018) > 0);
      ctx.strokeStyle = "#ece6da"; ctx.lineWidth = 1;
      for (const k of meteors) {
        k.x += k.vx; k.y += k.vy;
        const g2 = ctx.createLinearGradient(k.x, k.y, k.x - k.vx * 9, k.y - k.vy * 9);
        g2.addColorStop(0, "#ece6da"); g2.addColorStop(1, "#ece6da00");
        ctx.globalAlpha = k.life; ctx.strokeStyle = g2;
        ctx.beginPath(); ctx.moveTo(k.x, k.y); ctx.lineTo(k.x - k.vx * 9, k.y - k.vy * 9); ctx.stroke();
      }

      ctx.globalAlpha = 1;
      if (!still) raf = requestAnimationFrame(draw);
    };

    const onMove = (e: PointerEvent) => {
      m.tx = e.clientX / w - .5; m.ty = e.clientY / h - .5; m.px = e.clientX; m.py = e.clientY;
    };
    const onLeave = () => { m.px = m.py = -9999; };
    const onScroll = () => { sy = scrollY; maxS = Math.max(1, document.documentElement.scrollHeight - h); if (still) draw(0); };
    const onResize = () => { build(); if (still) draw(0); };

    build(); onScroll();
    if (still) draw(0); else raf = requestAnimationFrame(draw);
    addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
    };
  }, []);

  return <canvas ref={ref} className="cosmos" aria-hidden="true" />;
}
