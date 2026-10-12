import { ProjectCard, SectionTitle } from "@/components/ui";
import { projects } from "@/lib/data";

export const metadata = { title: "Projects" };

export default function Projects() {
  return (
    <section className="container page">
      <SectionTitle>Winners &amp; Grants</SectionTitle>
      {projects.filter((p) => p.award).map((p) => <div data-reveal suppressHydrationWarning key={p.name}><ProjectCard p={p} /></div>)}
      <SectionTitle>More Projects</SectionTitle>
      {projects.filter((p) => !p.award).map((p) => <div data-reveal suppressHydrationWarning key={p.name}><ProjectCard p={p} /></div>)}
    </section>
  );
}
