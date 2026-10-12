import { profile } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="footer">
      <p className="footer-quote">&ldquo;{profile.quote}&rdquo;</p>
      <a className="btn press to-top" href="#top">↑ Back to top</a>
      <p className="footer-made">Designed &amp; built by {profile.name}</p>
      <div className="footer-bottom">
        <span className="mono">© {profile.copyrightYear} {profile.name}</span>
        <span className="mono dim">{profile.location}</span>
      </div>
    </footer>
  );
}
