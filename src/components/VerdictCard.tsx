"use client";

import React, { useState, useEffect } from "react";
import { Activity } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface VerdictCardProps {
  title: string;
  icon: React.ReactNode;
  content: string;
  className?: string;
  accentColor?: string;
}

const indicatorColors: Record<string, string> = {
  "border-l-[3px] border-l-[#4CAF70]": "bg-[#4CAF70]",
  "border-l-[3px] border-l-[#F5A623]": "bg-[#F5A623]",
  "border-l-[3px] border-l-[#E8711A]": "bg-[#E8711A]",
  "border-l-[3px] border-l-blue-400": "bg-blue-400",
  "border-l-[3px] border-l-green-500": "bg-green-500",
  "border-l-[3px] border-l-orange-500": "bg-orange-500",
  "border-l-[3px] border-l-red-500": "bg-red-500",
  "border-l-[3px] border-l-blue-500": "bg-blue-500",
};

const accentHexMap: Record<string, string> = {
  "border-l-[3px] border-l-[#4CAF70]": "#4CAF70",
  "border-l-[3px] border-l-[#F5A623]": "#F5A623",
  "border-l-[3px] border-l-[#E8711A]": "#E8711A",
  "border-l-[3px] border-l-blue-400": "#60a5fa",
  "border-l-[3px] border-l-green-500": "#22c55e",
  "border-l-[3px] border-l-orange-500": "#f97316",
  "border-l-[3px] border-l-red-500": "#ef4444",
  "border-l-[3px] border-l-blue-500": "#3b82f6",
};

export default function VerdictCard({
  title,
  icon,
  content,
  className,
  accentColor,
}: VerdictCardProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const badgeColor = accentColor ? indicatorColors[accentColor] : "bg-gray-300";
  const accentHex = accentColor
    ? accentHexMap[accentColor] || "#E8711A"
    : "#E8711A";

  useEffect(() => {
    const fetchSummary = async () => {
      if (!content || summary || summaryLoading) return;

      setSummaryLoading(true);
      try {
        const r = await fetch("/api/council", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "summary",
            question: "",
            personaId: "skeptic",
            content,
          }),
        });
        const data = await r.json();
        setSummary(data.summary || null);
      } catch (err) {
        console.error("Summary fetch failed", err);
      } finally {
        setSummaryLoading(false);
      }
    };

    fetchSummary();
  }, [content, summary, summaryLoading]);

  return (
    <div
      className={`bg-white border border-[#E8E3DC] p-8 md:p-10 transition-all duration-300 group shadow-sm rounded-2xl ${className || ""}`}
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center justify-center w-10 h-10 border border-[#E8E3DC] bg-[#F5F2EC] text-[#9B1C1C] transition-colors duration-300">
          {icon}
        </div>
        <h3
          style={{ fontFamily: "var(--font-mono), IBM Plex Mono, monospace" }}
          className="text-[10px] font-bold text-[#1A1510] uppercase tracking-[0.25em]"
        >
          {title}
        </h3>
        {accentColor && (
          <div className="ml-auto">
            <div className={`w-1.5 h-1.5 ${badgeColor}`} />
          </div>
        )}
      </div>

      {/* Summary loading */}
      {summaryLoading && (
        <div className="flex items-center gap-2 py-2 mb-4">
          <span
            className="w-1.5 h-1.5 animate-pulse"
            style={{ backgroundColor: accentHex }}
          />
          <span
            style={{ fontFamily: "var(--font-mono), IBM Plex Mono, monospace" }}
            className="text-[9px] text-[#767676] uppercase tracking-wide"
          >
            Rendering summary...
          </span>
        </div>
      )}

      {/* Full content always renders first */}
      {!summaryLoading && (
        <div>
          {/* Show summary by default once loaded */}
          {summary && !expanded && (
            <div className="space-y-3">
              <div
                style={{
                  fontFamily: "var(--font-dm-sans), DM Sans, sans-serif",
                }}
                className="prose prose-sm max-w-none prose-p:leading-relaxed prose-p:text-[#1A1510]/80 prose-strong:text-[#1A1510]"
              >
                <MarkdownRenderer content={summary} />
              </div>
              <button
                onClick={() => setExpanded(true)}
                style={{
                  fontFamily: "var(--font-mono), IBM Plex Mono, monospace",
                }}
                className="text-[9px] uppercase tracking-widest font-medium text-[#9B1C1C] hover:underline transition-colors mt-2"
              >
                Show full response ↓
              </button>
            </div>
          )}

          {/* Full content — shown while summary loads, or when expanded */}
          {(!summary || expanded) && (
            <div className="space-y-3">
              <div
                style={{
                  fontFamily: "var(--font-dm-sans), DM Sans, sans-serif",
                }}
                className="prose prose-sm max-w-none prose-p:leading-relaxed prose-p:text-[#1A1510]/80 prose-strong:text-[#1A1510] prose-ul:list-disc prose-li:marker:text-[#9B1C1C]"
              >
                <MarkdownRenderer content={content} />
              </div>
              {summary && expanded && (
                <button
                  onClick={() => setExpanded(false)}
                  style={{
                    fontFamily: "var(--font-mono), IBM Plex Mono, monospace",
                  }}
                  className="text-[9px] uppercase tracking-widest font-medium text-[#9B1C1C] hover:underline transition-colors mt-2"
                >
                  Show summary ↑
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface ConfidenceBarProps {
  score: number;
  explanation: string;
}

export function ConfidenceBar({ score, explanation }: ConfidenceBarProps) {
  return (
    <div className="bg-white border border-[#E8E3DC] p-8 md:p-10 transition-colors duration-300 h-full shadow-sm rounded-2xl">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex items-center justify-center w-10 h-10 border border-[#E8E3DC] bg-[#F5F2EC] text-[#9B1C1C]">
          <Activity className="w-5 h-5" />
        </div>
        <h3
          style={{ fontFamily: "var(--font-mono), IBM Plex Mono, monospace" }}
          className="text-[10px] font-bold text-[#1A1510] uppercase tracking-[0.25em]"
        >
          Matra
        </h3>
        <div className="ml-auto">
          <div className="w-1.5 h-1.5 bg-[#9B1C1C]" />
        </div>
      </div>

      <span
        style={{ fontFamily: "var(--font-mono), IBM Plex Mono, monospace" }}
        className="text-6xl font-bold text-[#9B1C1C] block mb-6 tabular-nums tracking-tighter"
      >
        {score}%
      </span>

      <div className="w-full h-2 bg-[#F5F2EC] border border-[#E8E3DC] mb-6 relative">
        <div
          className="h-full bg-[#9B1C1C] transition-all duration-1000 ease-out"
          style={{ width: `${score}%` }}
        />
      </div>

      <p
        style={{ fontFamily: "var(--font-cormorant), Cormorant, serif" }}
        className="text-[15px] text-[#767676] italic leading-relaxed"
      >
        {explanation || "Based on Sabha agreement level"}
      </p>
    </div>
  );
}
