import Link from "next/link";
import CopyEmail from "@/components/CopyEmail";
import LocalTime from "@/components/LocalTime";
import Tally from "@/components/Tally";
import Contributions from "@/components/Contributions";
import Experience from "@/components/Experience";
import SpotifyPlayer from "@/components/SpotifyPlayer";
import { getPlaylist } from "@/lib/spotify";
import { ProjectCard, SectionTitle } from "@/components/ui";
import { achievements, communities, community, profile, projects, skills, skillIcons, socials } from "@/lib/data";

export default async function Home() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: `try{if(sessionStorage.getItem("entered"))document.documentElement.dataset.entered="1"}catch(e){}` }} />
      <SpotifyPlayer tracks={await getPlaylist()} />
      {/* Hero */}
      <section className="container">
        <div className="hero-profile enter" style={{ ["--i" as string]: 0 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="hero-avatar" src={profile.avatar} alt={profile.name} />
          <div className="hero-info">
            <h1 className="hero-name">
              <span className="name-letters" aria-label={profile.name}>
                {[...profile.name].map((c, i) => (
                  <span key={i} aria-hidden="true" style={{ ["--c" as string]: i }}>{c === " " ? "\u00a0" : c}</span>
                ))}
              </span>{" "}
              <span className="heart" aria-hidden="true">♥</span>
            </h1>
            <a className="hero-handle mono" href={profile.handleUrl} target="_blank" rel="noopener noreferrer">
              {profile.handle}
            </a>
            <a className="hero-status" href={profile.status.url} target="_blank" rel="noopener noreferrer">
              <span className="pulse" /> {profile.status.text}
            </a>
            <div className="hero-meta mono">
              <span>{profile.location}</span>
              <span className="dot">•</span>
              <span>{profile.role}</span>
              <span className="dot">•</span>
              <LocalTime />
            </div>
          </div>
        </div>

        <div className="wins enter" style={{ ["--i" as string]: 1 }}>
          <Tally count={profile.hackathonWins} />
          <span className="wins-label mono">{profile.hackathonWins} hackathons won, still counting</span>
        </div>

        <div className="orgs in hero-orgs">
          {communities.map((c, i) => (
            <a key={c.name} className="org dashed spot" href={c.url} target="_blank" rel="noopener noreferrer" style={{ ["--i" as string]: i }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={c.logo} alt="" width={40} height={40} />
              <span className="org-text">
                <b>{c.name}</b>
                <small className="mono">{c.role}</small>
              </span>
              <span className="org-arrow" aria-hidden="true">↗</span>
            </a>
          ))}
        </div>

        <ul className="about-bio">
          {profile.bio.map((line, i) => (
            <li key={i} className="enter" style={{ ["--i" as string]: i + 6 }}><span className="marker" /><span>{line}</span></li>
          ))}
        </ul>

        <div className="dashed connect enter" data-reveal suppressHydrationWarning style={{ ["--i" as string]: 9 }}>
          <div className="connect-head">
            <span className="connect-label mono">// get in touch</span>
            <div className="contact-row">
              <a className="btn press" href={`mailto:${profile.email}`}>Email me</a>
              <CopyEmail email={profile.email} />
              <a className="btn press" href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">Resume</a>
            </div>
          </div>
          <div className="community">
            <a className="spot community-card" href={community.twitter.url} target="_blank" rel="noopener noreferrer">
              <span className="community-icon">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-6.8 7.8L23 22h-6.2l-4.8-6.3L6.4 22H3.3l7.3-8.3L1 2h6.3l4.4 5.8L18.9 2Zm-1.1 18h1.7L6.3 3.9H4.5L17.8 20Z" /></svg>
              </span>
              <span className="community-text">
                <b>{community.twitter.name}</b>
                <small className="mono">{community.twitter.handle}</small>
              </span>
              <span className="community-arrow" aria-hidden="true">↗</span>
            </a>
            <a className="spot community-card" href="https://github.com/arko05roy" target="_blank" rel="noopener noreferrer">
              <span className="community-icon">
                <svg viewBox="0 0 24 24" width="17" height="17" fill="currentColor" aria-hidden="true"><path d="M12 .5a11.5 11.5 0 0 0-3.6 22.4c.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.9 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.2c0 .3.2.7.8.6A11.5 11.5 0 0 0 12 .5Z" /></svg>
              </span>
              <span className="community-text">
                <b>arko05roy</b>
                <small className="mono"><span className="online" /> 60+ public repos</small>
              </span>
              <span className="community-arrow" aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="container">
        <SectionTitle icon="sun">Work Experience</SectionTitle>
        <div data-reveal suppressHydrationWarning><Experience /></div>
      </section>

      {/* GitHub */}
      <section className="container">
        <SectionTitle icon="checker">GitHub Activity</SectionTitle>
        <Contributions />
      </section>

      {/* Projects */}
      <section className="container">
        <SectionTitle icon="planet">My Projects</SectionTitle>
        {projects.filter((p) => p.award).slice(0, 2).map((p) => <div data-reveal suppressHydrationWarning key={p.name}><ProjectCard p={p} /></div>)}
        <div className="right">
          <Link className="btn press view-all" href="/projects">More Projects <span className="arrow">→</span></Link>
        </div>
      </section>


      {/* Wins */}
      <section className="container">
        <SectionTitle icon="star">Hackathon Wins</SectionTitle>
        <ul className="wins-list dashed spot" data-reveal suppressHydrationWarning>
          {achievements.map((a) => (
            <li key={a.event}>
              <span>{a.event}{a.note && <small className="mono"> · {a.note}</small>}</span>
              <span className="leader" aria-hidden="true" />
              <span className="mono win-result">{a.result}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Skills */}
      <section className="container">
        <SectionTitle icon="moon">My Skills</SectionTitle>
        {[false, true].map((rev) => (
          <div className="marquee-wrap" key={String(rev)}>
            <div className={`marquee${rev ? " reverse" : ""}`}>
              {[...skills, ...skills, ...skills].map((s, i) => (
                <span className="skill-pill" key={i}>
                  {skillIcons[s]
                    ? <img src={`/logos/skills/${skillIcons[s]}.svg`} alt="" width={16} height={16} loading="lazy" />
                    : <span className="skill-mono" aria-hidden="true">{s[0]}</span>}
                  {s}
                </span>
              ))}
            </div>
          </div>
        ))}
        <p className="uses-teaser">
          Curious about my setup? <Link href="/uses">See my setup →</Link>
        </p>
      </section>


      {/* Contact */}
      <section className="container">
        <div className="dashed spot contact-card" data-reveal suppressHydrationWarning>
          <h2>Let&apos;s Connect</h2>
          <p>Feel free to reach out through any of these platforms</p>
          <div className="contact-links">
            {socials.map((s) => (
              <a key={s.label} className="btn press lift" href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
