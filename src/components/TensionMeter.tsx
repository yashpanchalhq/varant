"use client";

import { useEffect, useState } from "react";

interface TensionMeterProps {
  score: number | null;
  className?: string;
}

function getTensionLabel(score: number): string {
  if (score >= 71) return "High Tension";
  if (score >= 41) return "Moderate";
  if (score >= 1) return "Low Tension";
  return "Aligned";
}

export default function TensionMeter({ score, className }: TensionMeterProps) {
  const [animatedWidth, setAnimatedWidth] = useState(0);

  useEffect(() => {
    if (score !== null) {
      const t = setTimeout(() => setAnimatedWidth(score), 50);
      return () => clearTimeout(t);
    }
  }, [score]);

  if (score === null) return null;

  return (
    <div
      className={`border border-[#E8E3DC] p-5 bg-white rounded-2xl shadow-sm ${className || ""}`}
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-baseline justify-between">
          <span
            style={{ fontFamily: "var(--font-mono), IBM Plex Mono, monospace" }}
            className="text-[9px] font-bold text-[#767676] uppercase tracking-widest"
          >
            SANGHARSHA
          </span>
          <span
            style={{ fontFamily: "var(--font-mono), IBM Plex Mono, monospace" }}
            className="text-[11px] font-bold text-[#9B1C1C] uppercase tracking-widest"
          >
            {getTensionLabel(score)}
          </span>
        </div>
        <div className="w-full h-2 bg-[#F5F2EC] rounded-full overflow-hidden border border-[#E8E3DC]/50">
          <div
            className="h-full transition-all duration-1000 ease-out bg-[#9B1C1C] rounded-full"
            style={{ width: `${animatedWidth}%` }}
          />
        </div>
      </div>
    </div>
  );
}
