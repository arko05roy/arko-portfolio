"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef, useState } from "react";
import { profile } from "@/lib/data";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/resume", label: "Resume" },
  { href: "/support", label: "Support" },
];

export default function Navbar() {
  const pathname = usePathname();
  const wrap = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<string | null>(null);
  const [pill, setPill] = useState({ x: 0, w: 0, on: false });
  const target = hover ?? pathname;

  useLayoutEffect(() => {
    const el = wrap.current?.querySelector<HTMLElement>(`[data-href="${target}"]`);
    setPill(el ? { x: el.offsetLeft, w: el.offsetWidth, on: true } : (p) => ({ ...p, on: false }));
  }, [target]);

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-links" ref={wrap} onMouseLeave={() => setHover(null)}>
          <span
            className="nav-pill"
            aria-hidden="true"
            style={{ transform: `translateX(${pill.x}px)`, width: pill.w, opacity: pill.on ? 1 : 0 }}
          />
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              data-href={l.href}
              onMouseEnter={() => setHover(l.href)}
              className={`navbar-link${pathname === l.href ? " active" : ""}`}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <a className="navbar-star" href={profile.githubRepo} target="_blank" rel="noopener noreferrer" title="Star this portfolio on GitHub">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
          <span>Star</span>
        </a>
      </div>
    </nav>
  );
}
