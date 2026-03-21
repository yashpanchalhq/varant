"use client";

import React, { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";

const PRESET_ROLES = [
  "Co-founder",
  "Advisor",
  "Investor",
  "Domain Expert",
  "Product Manager",
  "Research Lead",
];

interface TeamSession {
  id: string;
  decision: string;
}

export default function JoinSessionPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const router = useRouter();
  const { code } = use(params);

  const [session, setSession] = useState<TeamSession | null>(null);
  const [name, setName] = useState("");
  const [selectedRole, setSelectedRole] = useState("Co-founder");
  const [customRole, setCustomRole] = useState("");
  const [isCustom, setIsCustom] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await fetch(`/api/team/${code}`);
        if (res.ok) {
          const data = await res.json();
          setSession(data);
        }
      } catch (error) {
        console.error("Fetch session failed", error);
      }
    };
    fetchSession();
  }, [code]);

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalRole = isCustom ? customRole : selectedRole;
    if (!name.trim() || !finalRole.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/team/${code}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          role: finalRole.trim(),
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Join failed:", res.status, errorText);
        setLoading(false);
        return;
      }

      const data = await res.json();
      console.log("Join success:", data);

      // Store in session storage like host does
      sessionStorage.setItem(
        "Varant_team_member",
        JSON.stringify({
          id: data.memberId,
          name: name.trim(),
          role: finalRole.trim(),
          color: data.color,
          isHost: false,
          code,
        }),
      );

      router.push(
        `/team/session/${code}?member=${encodeURIComponent(name.trim())}`,
      );
    } catch (err) {
      console.error("Join error:", err);
      setLoading(false);
    }
  };

  const isButtonDisabled =
    loading || !name.trim() || (!selectedRole && !customRole.trim());

  return (
    <main className="min-h-screen bg-[#FAF9F7] text-[#1A1510] flex flex-col items-center px-6 pt-[120px] pb-20 selection:bg-[#9B1C1C]/20">
      <div className="max-w-[520px] w-full text-center">
        {/* Eyebrow */}
        <span
          style={{ fontFamily: "var(--font-mono), IBM Plex Mono, monospace" }}
          className="text-[10px] text-[#9B1C1C] font-semibold tracking-[0.25em] mb-6 block uppercase"
        >
          TEAM SABHA · JOIN SESSION
        </span>

        {/* H1 */}
        <h1
          style={{ fontFamily: "var(--font-cormorant), Cormorant, serif" }}
          className="text-[48px] font-[300] leading-tight mb-6 text-[#1A1510]"
        >
          You have been <br />
          <em className="italic">called to counsel.</em>
        </h1>

        {/* Sub */}
        <p
          style={{ fontFamily: "var(--font-cormorant), Cormorant, serif" }}
          className="text-[18px] italic text-[#767676] mb-12 font-light"
        >
          A team is deliberating an irreversible decision. <br />
          Your voice will be heard.
        </p>

        {/* Card */}
        <div className="bg-white border border-[#E8E3DC] p-[48px] text-left rounded-2xl shadow-sm hover:shadow-md transition-all">
          {/* Decision Preview */}
          {session && (
            <div className="mb-10">
              <span
                style={{
                  fontFamily: "var(--font-mono), IBM Plex Mono, monospace",
                }}
                className="text-[10px] text-[#767676] uppercase block mb-4 font-bold tracking-widest"
              >
                THE VARA BEFORE THE COUNCIL
              </span>
              <div className="border-l-2 border-[#9B1C1C]/30 pl-6">
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), Cormorant, serif",
                  }}
                  className="text-[20px] italic text-[#1A1510] leading-relaxed"
                >
                  &ldquo;{session.decision}&rdquo;
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleJoin} className="space-y-8">
            {/* Name Input */}
            <div className="flex flex-col">
              <label
                style={{
                  fontFamily: "var(--font-mono), IBM Plex Mono, monospace",
                }}
                className="text-[10px] text-[#9B1C1C] uppercase mb-2 font-bold tracking-widest"
              >
                YOUR NAME
              </label>
              <input
                required
                type="text"
                placeholder="How will the Sabha address you?"
                style={{
                  fontFamily: "var(--font-dm-sans), DM Sans, sans-serif",
                }}
                className="bg-transparent border-b border-[#E8E3DC] py-[12px] text-[16px] text-[#1A1510] focus:outline-none focus:border-[#9B1C1C] transition-all placeholder:text-[#B8B0A8]"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            {/* Role Selection */}
            <div className="flex flex-col pt-2">
              <label
                style={{
                  fontFamily: "var(--font-mono), IBM Plex Mono, monospace",
                }}
                className="text-[9px] text-[#C17F24] uppercase mb-4 font-bold tracking-widest"
              >
                YOUR ROLE
              </label>
              <div className="flex flex-wrap gap-[8px] mt-[12px]">
                {PRESET_ROLES.map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => {
                      setSelectedRole(role);
                      setIsCustom(false);
                      setCustomRole("");
                    }}
                    style={{
                      fontFamily: "var(--font-dm-sans), DM Sans, sans-serif",
                      border:
                        selectedRole === role && !isCustom
                          ? "1px solid #C17F24"
                          : "1px solid rgba(193,127,36,0.2)",
                      background:
                        selectedRole === role && !isCustom
                          ? "rgba(193,127,36,0.08)"
                          : "transparent",
                      color:
                        selectedRole === role && !isCustom
                          ? "#C17F24"
                          : "#4A4740",
                      padding: "8px 16px",
                    }}
                    className="text-[12px] cursor-pointer rounded-0 transition-all"
                  >
                    {role}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setIsCustom(true);
                    setSelectedRole("");
                  }}
                  style={{
                    fontFamily: "var(--font-dm-sans), DM Sans, sans-serif",
                    border: isCustom
                      ? "1px solid #C17F24"
                      : "1px solid rgba(193,127,36,0.2)",
                    background: isCustom
                      ? "rgba(193,127,36,0.08)"
                      : "transparent",
                    color: isCustom ? "#C17F24" : "#4A4740",
                    padding: "8px 16px",
                  }}
                  className="text-[12px] cursor-pointer rounded-0 transition-all"
                >
                  Custom +
                </button>
              </div>

              {isCustom && (
                <div className="mt-[12px]">
                  <input
                    type="text"
                    placeholder="Enter your role..."
                    style={{
                      fontFamily: "var(--font-dm-sans), DM Sans, sans-serif",
                    }}
                    className="w-full bg-transparent border-none border-b border-[rgba(193,127,36,0.3)] py-[8px] text-[14px] text-[#1A1510] focus:outline-none focus:border-[#C17F24] transition-all placeholder:text-[#B8B0A8]"
                    value={customRole}
                    onChange={(e) => {
                      setCustomRole(e.target.value);
                      setSelectedRole(e.target.value);
                    }}
                  />
                </div>
              )}
            </div>

            {/* Join Button */}
            <button
              type="submit"
              disabled={isButtonDisabled}
              style={{
                fontFamily: "var(--font-mono), IBM Plex Mono, monospace",
              }}
              className="w-full bg-[#1A1510] text-white py-5 rounded-full text-[12px] font-bold uppercase tracking-[0.15em] transition-all disabled:opacity-30 disabled:cursor-not-allowed mt-10 border-none cursor-pointer hover:bg-[#9B1C1C] shadow-lg"
            >
              {loading ? "Joining..." : "TAKE YOUR SEAT →"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
