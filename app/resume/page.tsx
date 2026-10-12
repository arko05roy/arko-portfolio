import { SectionTitle } from "@/components/ui";
import { resume } from "@/lib/data";

export const metadata = { title: "Resume" };

export default function Resume() {
  return (
    <section className="container page">
      <div className="page-head">
        <SectionTitle>Resume</SectionTitle>
        <a className="btn" href={resume.downloadUrl} target="_blank" rel="noopener noreferrer">Download ↓</a>
      </div>
      <div className="dashed resume-frame">
        {resume.pdfUrl ? (
          <iframe src={resume.pdfUrl} title="Resume" />
        ) : (
          <p className="dim">Add your resume link in <code>lib/data.tsx</code> → <code>resume.pdfUrl</code></p>
        )}
      </div>
    </section>
  );
}
