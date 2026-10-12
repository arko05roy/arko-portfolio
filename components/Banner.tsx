"use client";

import { useState } from "react";

// Project banner that falls back to the logo on a quiet tile if the image fails.
export default function Banner({ src, alt, logo }: { src: string; alt: string; logo?: string }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className="banner-fallback">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt={alt} />
        ) : (
          <span>{alt}</span>
        )}
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />;
}
