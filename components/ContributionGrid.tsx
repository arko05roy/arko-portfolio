"use client";

import { useEffect, useRef, useState } from "react";

export type Day = { date: string; count: number; level: number };

const fmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
const monthFmt = new Intl.DateTimeFormat("en-US", { month: "short", timeZone: "UTC" });

export default function ContributionGrid({ days, total, user }: { days: Day[]; total: number; user: string }) {
  const scroller = useRef<HTMLDivElement>(null);
  const [tip, setTip] = useState<{ d: Day; x: number; y: number } | null>(null);

  // Pad so the first column starts on Sunday, like GitHub.
  const lead = new Date(days[0].date + "T00:00:00Z").getUTCDay();
  const cells: (Day | null)[] = [...Array(lead).fill(null), ...days];
  const weeks = Math.ceil(cells.length / 7);

  const months: { label: string; col: number }[] = [];
  for (let w = 0; w < weeks; w++) {
    const d = cells[w * 7] ?? cells[w * 7 + lead];
    if (!d) continue;
    const label = monthFmt.format(new Date(d.date + "T00:00:00Z"));
    if (months.at(-1)?.label !== label) months.push({ label, col: w });
  }

  const streak = (() => {
    let best = 0, cur = 0;
    for (const d of days) { cur = d.count ? cur + 1 : 0; best = Math.max(best, cur); }
    return best;
  })();

  useEffect(() => {
    const el = scroller.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, []);

  return (
    <div className="contrib dashed spot" data-reveal suppressHydrationWarning>
      <div className="contrib-head">
        <span><b>{total.toLocaleString()}</b> contributions in the last year</span>
        <span className="mono dim">longest streak {streak}d</span>
      </div>
      <div className="contrib-scroll" ref={scroller} onMouseLeave={() => setTip(null)}>
        <div className="contrib-months" style={{ gridTemplateColumns: `repeat(${weeks}, 11px)` }}>
          {months.map((m) => <span key={m.col} style={{ gridColumnStart: m.col + 1 }}>{m.label}</span>)}
        </div>
        <div className="contrib-grid" style={{ gridTemplateColumns: `repeat(${weeks}, 11px)` }}>
          {cells.map((d, i) =>
            d ? (
              <span
                key={d.date}
                className={`cell l${d.level}`}
                style={{ ["--w" as string]: Math.floor(i / 7) }}
                onMouseEnter={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  setTip({ d, x: r.left + r.width / 2, y: r.top });
                }}
              />
            ) : <span key={`pad${i}`} />,
          )}
        </div>
      </div>
      <div className="contrib-foot mono">
        <a href={`https://github.com/${user}`} target="_blank" rel="noopener noreferrer">@{user} →</a>
        <span className="legend">Less {[0, 1, 2, 3, 4].map((l) => <span key={l} className={`cell l${l}`} />)} More</span>
      </div>
      {tip && (
        <div className="contrib-tip mono" style={{ left: tip.x, top: tip.y }}>
          {tip.d.count || "No"} contribution{tip.d.count === 1 ? "" : "s"} · {fmt.format(new Date(tip.d.date + "T00:00:00Z"))}
        </div>
      )}
    </div>
  );
}
