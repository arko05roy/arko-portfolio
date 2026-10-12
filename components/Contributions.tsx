import ContributionGrid, { type Day } from "./ContributionGrid";

const USER = "arko05roy";

export default async function Contributions() {
  let days: Day[] = [];
  let total = 0;
  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${USER}?y=last`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const json = await res.json();
      days = json.contributions;
      total = json.total.lastYear;
    }
  } catch {}

  if (!days.length) {
    return <p className="uses-teaser">Contribution graph is unavailable right now. <a href={`https://github.com/${USER}`}>See it on GitHub →</a></p>;
  }
  return <ContributionGrid days={days} total={total} user={USER} />;
}
