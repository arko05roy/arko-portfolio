import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container page not-found">
      <h1 className="mono">404</h1>
      <p className="dim">This page wandered off.</p>
      <Link className="btn" href="/">← Back home</Link>
    </section>
  );
}
