// Hackathon wins drawn as tally marks: groups of five, the fifth struck through.
export default function Tally({ count }: { count: number }) {
  const groups = Array.from({ length: Math.ceil(count / 5) }, (_, g) => Math.min(5, count - g * 5));
  let n = 0;
  return (
    <div className="tally" role="img" aria-label={`${count} hackathon wins`}>
      {groups.map((size, g) => (
        <svg key={g} width={size === 5 ? 46 : size * 9 + 4} height="34" viewBox={`0 0 ${size === 5 ? 46 : size * 9 + 4} 34`} aria-hidden="true">
          {Array.from({ length: size }, (_, i) => {
            const d = n++;
            return i < 4 ? (
              <path key={i} d={`M${6 + i * 9} ${4 + (i % 2)} L${5 + i * 9} ${30 - (i % 2)}`} style={{ ["--d" as string]: d }} />
            ) : (
              <path key={i} d="M1 26 L44 8" className="strike" style={{ ["--d" as string]: d }} />
            );
          })}
        </svg>
      ))}
    </div>
  );
}
