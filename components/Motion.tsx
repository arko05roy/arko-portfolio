"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

// Page-wide micro-interactions: scroll reveals, cursor spotlight on cards, scroll progress.
export default function Motion() {
  const pathname = usePathname();
  const cursor = useRef<HTMLDivElement>(null);
  const lenis = useRef<Lenis | null>(null);

  // Lenis smooth scroll; its velocity drives a faint skew on the page content
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const l = new Lenis({ autoRaf: true, lerp: .1, anchors: { offset: -80 } });
    lenis.current = l;
    const root = document.documentElement;
    l.on("scroll", ({ velocity }: Lenis) => {
      root.style.setProperty("--vel", String(Math.max(-1, Math.min(1, velocity / 40))));
    });
    return () => { l.destroy(); lenis.current = null; };
  }, []);

  useEffect(() => { lenis.current?.scrollTo(0, { immediate: true }); }, [pathname]);

  // Click ripple on buttons, and a decode/scramble on small mono labels when hovered
  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      const b = (e.target as HTMLElement).closest<HTMLElement>(".btn");
      if (!b) return;
      const r = b.getBoundingClientRect(), dot = document.createElement("span");
      dot.className = "ripple";
      dot.style.left = `${e.clientX - r.left}px`; dot.style.top = `${e.clientY - r.top}px`;
      b.appendChild(dot);
      dot.addEventListener("animationend", () => dot.remove());
    };
    const GLYPHS = "!<>-_/[]{}=+*^?#01";
    const busy = new WeakSet<HTMLElement>();
    const onOver = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>(".connect-label, .hero-handle, .exp-meta, .wins-label");
      if (!el || busy.has(el) || el.children.length) return;
      busy.add(el);
      const final = el.textContent ?? "";
      let f = 0;
      const step = () => {
        const done = f / 2;
        el.textContent = [...final].map((c, i) => (i < done || c === " " ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0])).join("");
        if (done < final.length) { f++; requestAnimationFrame(step); } else { el.textContent = final; busy.delete(el); }
      };
      step();
    };
    addEventListener("pointerdown", onDown);
    if (!matchMedia("(prefers-reduced-motion: reduce)").matches) addEventListener("pointerover", onOver);
    return () => { removeEventListener("pointerdown", onDown); removeEventListener("pointerover", onOver); };
  }, []);

  useEffect(() => {
    // content is only hidden-for-reveal once this runs, so a JS failure never leaves the page blank
    document.documentElement.classList.add("reveal-ready");
    const els = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }),
      { rootMargin: "0px 0px -8% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>(".spot");
      if (!el) return;
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    };
    const onScroll = () => {
      const h = document.documentElement;
      const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      h.style.setProperty("--progress", String(p));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // Trailing ring cursor that swells over interactive things, plus magnetic buttons.
  useEffect(() => {
    const c = cursor.current;
    if (!c || !matchMedia("(pointer: fine)").matches || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    document.documentElement.classList.add("has-cursor");
    const p = { x: -100, y: -100, tx: -100, ty: -100 };
    let raf = 0, mag: HTMLElement | null = null;
    const tick = () => {
      p.x += (p.tx - p.x) * .2; p.y += (p.ty - p.y) * .2;
      c.style.transform = `translate(${p.x}px, ${p.y}px)`;
      raf = requestAnimationFrame(tick);
    };
    const onMove = (e: PointerEvent) => {
      p.tx = e.clientX; p.ty = e.clientY;
      const t = e.target as HTMLElement;
      c.classList.toggle("hot", !!t.closest("a, button, [role=button], .cell"));
      const m = t.closest<HTMLElement>(".btn, .navbar-star, .chip, .project-links a");
      if (mag && mag !== m) { mag.style.transform = ""; mag = null; }
      if (m) {
        const r = m.getBoundingClientRect();
        m.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
        mag = m;
      }
    };
    const onDown = () => c.classList.add("down");
    const onUp = () => c.classList.remove("down");
    addEventListener("pointermove", onMove, { passive: true });
    addEventListener("pointerdown", onDown);
    addEventListener("pointerup", onUp);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
      removeEventListener("pointermove", onMove);
      removeEventListener("pointerdown", onDown);
      removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <>
      <div className="progress" aria-hidden="true" />
      <div className="cursor" ref={cursor} aria-hidden="true" />
    </>
  );
}
