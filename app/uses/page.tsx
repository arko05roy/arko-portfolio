import { SectionTitle } from "@/components/ui";
import { uses } from "@/lib/data";

export const metadata = { title: "Uses" };

export default function Uses() {
  return (
    <section className="container page">
      <SectionTitle>What I Use</SectionTitle>
      {uses.map((g) => (
        <div key={g.category} className="dashed uses-group">
          <h3>{g.category}</h3>
          <ul>
            {g.items.map((it) => (
              <li key={it.name}><b>{it.name}</b> <span className="dim">— {it.note}</span></li>
            ))}
          </ul>
        </div>
      ))}
    </section>
  );
}
