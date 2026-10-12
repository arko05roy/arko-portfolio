import Banner from "./Banner";
import type { Project } from "@/lib/data";

export function SectionTitle({ children }: { children: React.ReactNode; icon?: string }) {
  return (
    <h2 className="card-title" data-reveal suppressHydrationWarning>
      {typeof children === "string" ? (
        <span aria-label={children}>
          {[...children].map((ch, i) => (
            <span key={i} className="ch" aria-hidden="true" style={{ ["--c" as string]: i }}>{ch === " " ? "\u00a0" : ch}</span>
          ))}
        </span>
      ) : <span>{children}</span>}
      <span className="title-rule" aria-hidden="true" />
    </h2>
  );
}

export function ProjectCard({ p }: { p: Project }) {
  return (
    <article className="project-card spot">
      <div className="banner">
        <Banner src={p.image} alt={p.name} logo={p.logo} />
      </div>
      <div className="project-details">
        <div className="project-header-row">
          <h3 className="project-name">
            {p.logo && (
              // eslint-disable-next-line @next/next/no-img-element
              <img className="project-logo" src={p.logo} alt="" width={22} height={22} />
            )}
            {p.name}
            {p.status && (
              <span className={`status-dot ${p.status}`} title={p.status === "live" ? "Live" : "In progress"}>●</span>
            )}
          </h3>
          <div className="project-links">
            {p.live && <a href={p.live} target="_blank" rel="noopener noreferrer">Live</a>}
            {p.github && <a href={p.github} target="_blank" rel="noopener noreferrer">GitHub</a>}
          </div>
        </div>
        {p.award && <span className="project-award mono">★ {p.award}</span>}
        <p className="project-desc">{p.description}</p>
        <span className="project-tech-label">Tech Stack</span>
        <div className="project-tech">
          {p.tech.map((t) => <span key={t}>{t}</span>)}
        </div>
      </div>
    </article>
  );
}

export function Chip({ logo, href, children }: { logo: string; href: string; children: React.ReactNode }) {
  return (
    <a className="chip" href={href} target="_blank" rel="noopener noreferrer">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo} alt="" width={16} height={16} />
      {children}
    </a>
  );
}
