import { SectionTitle } from "@/components/ui";
import { support } from "@/lib/data";

export const metadata = { title: "Support" };

export default function Support() {
  return (
    <section className="container page">
      <SectionTitle>Support My Work</SectionTitle>
      <div className="dashed contact-card">
        <p>{support.message}</p>
        <div className="contact-links">
          {support.links.map((l) => (
            <a key={l.label} className="btn lift" href={l.url} target="_blank" rel="noopener noreferrer">{l.label}</a>
          ))}
        </div>
      </div>
    </section>
  );
}
