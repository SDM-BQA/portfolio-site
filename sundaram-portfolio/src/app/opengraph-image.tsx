import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.name}, ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 80,
        background: "#101114",
        color: "#F3F2F7",
      }}
    >
      <div style={{ display: "flex", fontSize: 30, fontWeight: 700 }}>
        SUNDARAMTECH<span style={{ color: "#A78BFA" }}>.DEV</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 84, fontWeight: 700 }}>{profile.name}</div>
        <div style={{ marginTop: 16, fontSize: 40, color: "#A78BFA" }}>{profile.role}</div>
        <div style={{ marginTop: 24, fontSize: 30, color: "#A5A6B0" }}>{profile.tagline}</div>
      </div>
    </div>,
    size,
  );
}
