import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Arko Roy — developer, 16× hackathon winner";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const avatar = await readFile(join(process.cwd(), "app/icon.png"));
  const src = `data:image/png;base64,${avatar.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          padding: "0 96px",
          gap: 72,
          background: "radial-gradient(circle at 80% 20%, #13261b 0%, #0b0d0e 55%)",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <img
          src={src}
          width={300}
          height={300}
          style={{ borderRadius: 40, border: "2px solid #2a2b2c", boxShadow: "0 30px 80px rgba(0,0,0,.6)" }}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 26, color: "#02ff67" }}>
            <div style={{ width: 14, height: 14, borderRadius: 7, background: "#02ff67" }} />
            Open to new roles
          </div>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -3, lineHeight: 1 }}>Arko Roy</div>
          <div style={{ fontSize: 38, color: "#b3b3b3" }}>Developer · 16× hackathon winner</div>
          <div style={{ fontSize: 28, color: "#8c8c8c", marginTop: 16 }}>notarko.vercel.app</div>
        </div>
      </div>
    ),
    size,
  );
}
