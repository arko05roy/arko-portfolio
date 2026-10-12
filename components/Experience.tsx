"use client";

import { useState } from "react";
import { experience } from "@/lib/data";

const label = { present: "Active", past: "Done", future: "Upcoming" } as const;

export default function Experience() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="timeline spot">
      <div className="timeline-line" />
      {experience.map((e, i) => (
        <div className="timeline-item" key={e.company}>
          <span className={`timeline-dot ${e.status}`} />
          <div className="exp-card">
            <div className="exp-header">
              <div className="exp-left">
                <div className="exp-logo">
                  {e.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={e.logo} alt="" />
                  ) : (
                    e.company[0]
                  )}
                </div>
                <div>
                  <div className="exp-company-row">
                    {e.url ? (
                      <a href={e.url} target="_blank" rel="noopener noreferrer" className="exp-company">{e.company}</a>
                    ) : (
                      <span className="exp-company">{e.company}</span>
                    )}
                    <span className={`exp-badge ${e.status}`}>
                      <span className="exp-badge-dot">●</span> {label[e.status]}
                    </span>
                  </div>
                  <div className="exp-role">{e.role}</div>
                </div>
              </div>
              <div className="exp-right">
                <span className="exp-meta">{e.period}</span>
                <button
                  className={`exp-expand${open === i ? " open" : ""}`}
                  aria-label="Toggle details"
                  aria-expanded={open === i}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  ▾
                </button>
              </div>
            </div>
            <div className={`exp-details${open === i ? " expanded" : ""}`}>
              <ul>{e.bullets.map((b) => <li key={b}>{b}</li>)}</ul>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
