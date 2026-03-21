"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Users, ArrowRight, Share2, Copy, Check } from "lucide-react";
import Link from "next/link";

export default function TeamLandingPage() {
  const [decision, setDecision] = useState("");
  const [context, setContext] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdCode, setCreatedCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/team/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decision, context }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Server returned error:", res.status, text);
        throw new Error(`Failed to create session: ${res.status}`);
      }

      const data = await res.json();
      if (data.code) {
        router.push(`/team/created/${data.code}`);
      }
    } catch (error) {
      console.error("Failed to create session:", error);
      alert(
        "There was an error creating the session. Please check the console for details.",
      );
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    const url = `${window.location.origin}/team/join/${createdCode}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-[#FAF9F7] text-[#1A1510] selection:bg-[#9B1C1C]/20 selection:text-[#9B1C1C]">
      <div className="relative z-10 max-w-4xl mx-auto px-6 py-16">
        {!createdCode ? (
          <div className="reveal">
            <span
              style={{
                fontFamily: "var(--font-mono), IBM Plex Mono, monospace",
              }}
              className="text-[10px] text-[#9B1C1C] font-semibold tracking-[0.2em] uppercase mb-6 block"
            >
              B2B · Multi-user Deliberation
            </span>
            <h1
              style={{ fontFamily: "var(--font-cormorant), Cormorant, serif" }}
              className="text-5xl md:text-6xl lg:text-[64px] font-light leading-tight mb-8 text-[#1A1510]"
            >
              Convene a <br />
              <span className="italic text-[#9B1C1C]">Shared Sabha.</span>
            </h1>
            <p
              style={{ fontFamily: "var(--font-dm-sans), DM Sans, sans-serif" }}
              className="text-[#555] text-lg md:text-xl max-w-xl mb-12 font-light leading-relaxed"
            >
              Invite your co-founders, investors, or advisors to deliberate
              together. One decision, multiple human voices, four AI personas.
            </p>

            <form
              onSubmit={handleCreate}
              className="space-y-8 bg-white p-10 rounded-2xl border border-[#E8E3DC] shadow-sm hover:shadow-md transition-all"
            >
              <div className="space-y-4 text-left">
                <label
                  style={{
                    fontFamily: "var(--font-mono), IBM Plex Mono, monospace",
                  }}
                  className="text-[10px] uppercase tracking-widest text-[#9B1C1C] font-bold"
                >
                  The Decision Vara
                </label>
                <textarea
                  required
                  placeholder="What is the irreversible bet your team is weighing?"
                  style={{
                    fontFamily: "var(--font-cormorant), Cormorant, serif",
                  }}
                  className="w-full bg-transparent border-b border-[#E8E3DC] py-4 text-2xl focus:outline-none focus:border-[#9B1C1C] transition-all resize-none italic text-[#1A1510] placeholder:text-[#B8B0A8]"
                  value={decision}
                  onChange={(e) => setDecision(e.target.value)}
                />
              </div>

              <div className="space-y-4 text-left">
                <label
                  style={{
                    fontFamily: "var(--font-mono), IBM Plex Mono, monospace",
                  }}
                  className="text-[10px] uppercase tracking-widest text-[#767676] font-bold"
                >
                  Context & Constraints (Optional)
                </label>
                <textarea
                  placeholder="Revenue, team size, timeline, or what's at stake..."
                  style={{
                    fontFamily: "var(--font-dm-sans), DM Sans, sans-serif",
                  }}
                  className="w-full bg-transparent border-b border-[#E8E3DC] py-4 text-lg focus:outline-none focus:border-[#9B1C1C] transition-all resize-none text-[#1A1510] placeholder:text-[#B8B0A8]"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !decision}
                style={{
                  fontFamily: "var(--font-mono), IBM Plex Mono, monospace",
                }}
                className="w-full bg-[#1A1510] text-white py-5 rounded-full text-[11px] font-bold uppercase tracking-[0.2em] transition-all disabled:opacity-40 hover:bg-[#9B1C1C] flex items-center justify-center gap-3 shadow-sm hover:shadow-lg"
              >
                {loading ? "INITIALIZING SABHA..." : "BEGIN TEAM VICHAR →"}
              </button>
            </form>
          </div>
        ) : (
          <div className="reveal max-w-xl mx-auto text-center">
            {/* Success state handled by router.push */}
          </div>
        )}
      </div>
    </main>
  );
}
