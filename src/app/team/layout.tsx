import React from "react";
import Link from "next/link";
import { Cormorant, DM_Sans, IBM_Plex_Mono } from "next/font/google";

const cormorant = Cormorant({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-sans",
});
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-mono",
});

export default function TeamLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${cormorant.variable} ${dmSans.variable} ${ibmPlexMono.variable}`}
      style={{
        minHeight: "100vh",
        background: "#FAF9F7",
        color: "#1A1510",
        fontFamily: "var(--font-dm-sans), DM Sans, sans-serif",
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* Shared Team Navbar */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 48px",
          background: "rgba(250,249,247,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(26, 21, 16, 0.05)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-cormorant), Cormorant, serif",
              fontStyle: "italic",
              fontWeight: 300,
              fontSize: 24,
              color: "#9B1C1C",
              textDecoration: "none",
              letterSpacing: "0.04em",
            }}
          >
            Varant
          </Link>
          <span
            style={{
              fontFamily: "var(--font-mono), IBM Plex Mono, monospace",
              fontSize: 10,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              color: "#767676",
              paddingLeft: 16,
              borderLeft: "1px solid #E8E3DC",
            }}
          >
            TEAM SABHA
          </span>
        </div>
        <Link
          href="/team"
          style={{
            fontFamily: "var(--font-mono), IBM Plex Mono, monospace",
            fontSize: 11,
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            color: "#1A1510",
            textDecoration: "none",
            border: "1px solid #E8E3DC",
            padding: "10px 24px",
            borderRadius: "9999px",
            transition: "all 0.2s ease",
            backgroundColor: "white",
          }}
          className="hover:bg-[#1A1510] hover:text-white"
        >
          EXIT SABHA
        </Link>
      </nav>
      <div style={{ paddingTop: 80 }}>{children}</div>
    </div>
  );
}
