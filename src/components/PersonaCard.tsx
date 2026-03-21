"use client";

import { useState, useEffect } from "react";
import { ShieldAlert, Sparkles, Anchor, Shuffle } from "lucide-react";
import {
  Persona,
  PersonaResponse,
  PersonaStatus,
  PersonaId,
} from "@/types/council";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import { PERSONAS } from "@/lib/prompts";

interface PersonaCardProps {
  persona: Persona;
  response?: PersonaResponse;
  status?: PersonaStatus;
}

const personaIcons: Record<PersonaId, React.ReactNode> = {
  skeptic: <ShieldAlert className="w-4 h-4" />,
  optimist: <Sparkles className="w-4 h-4" />,
  pragmatist: <Anchor className="w-4 h-4" />,
  "devils-advocate": <Shuffle className="w-4 h-4" />,
};

const personaSanskrit: Record<PersonaId, string> = {
  skeptic: "वितर्क",
  optimist: "आशा",
  pragmatist: "युक्ति",
  "devils-advocate": "विपक्ष",
};

const accentHex: Record<string, string> = {
  red: "#B91C1C",
  green: "#15803D",
  yellow: "#A16207",
  blue: "#1E40AF",
};

const dotColor: Record<string, string> = {
  red: "bg-[#B91C1C]",
  green: "bg-[#15803D]",
  yellow: "bg-[#A16207]",
  blue: "bg-[#1E40AF]",
};

function parseRebuttal(content: string): {
  quote: string | null;
  source: string | null;
  body: string;
} {
  const match = content.match(
    /^REBUTTING\s+(.+?):\s*["""](.+?)["""]\s*\n([\s\S]*)$/i,
  );
  if (match)
    return {
      source: match[1].trim(),
      quote: match[2].trim(),
      body: match[3].trim(),
    };
  const match2 = content.match(/^REBUTTING\s+(.+?):\s*(.+?)\n([\s\S]*)$/i);
  if (match2)
    return {
      source: match2[1].trim(),
      quote: match2[2].trim(),
      body: match2[3].trim(),
    };
  return { quote: null, source: null, body: content };
}

function getSourceDotColor(sourceName: string): string {
  const p = PERSONAS.find((x) =>
    x.name.toLowerCase().includes(sourceName.toLowerCase().replace("the ", "")),
  );
  return p ? dotColor[p.color] : "bg-[#78716c]";
}

export default function PersonaCard({
  persona,
  response,
  status,
}: PersonaCardProps) {
  const [summary, setSummary] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const effectiveStatus =
    status ||
    response?.status ||
    (response?.loading ? "speaking" : response?.content ? "done" : "waiting");
  const isSpeaking = effectiveStatus === "speaking";
  const isWaiting = effectiveStatus === "waiting";
  const isDone = effectiveStatus === "done";
  const hasContent = !!response?.content;
  const hasError = !!response?.error;

  const color = accentHex[persona.color] || "#1A1510";
  const { quote, source, body } = hasContent
    ? parseRebuttal(response!.content)
    : { quote: null, source: null, body: "" };

  // Auto-fetch summary when done
  useEffect(() => {
    const fetchSummary = async () => {
      if (!isDone || !hasContent || summary || summaryLoading) return;

      setSummaryLoading(true);
      try {
        const r = await fetch("/api/council", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "summary",
            question: "",
            personaId: persona.id,
            content: response!.content,
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
  }, [isDone, hasContent, persona.id, response, summary, summaryLoading]);

  return (
    <div
      className={`varant-persona-card relative flex flex-col h-full min-h-[220px] transition-all duration-300 border border-[#E8E3DC] bg-white rounded-2xl shadow-sm ${
        isSpeaking ? "border-[#9B1C1C] ring-1 ring-[#9B1C1C]/20 shadow-md" : ""
      } ${isWaiting && !hasContent ? "opacity-55" : ""}`}
    >
      <div className="flex items-center justify-between p-5 border-b border-[#E8E3DC]">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 flex items-center justify-center border border-[#E8E3DC] bg-[#FAF9F7] rounded-xl"
            style={{ color }}
          >
            {personaIcons[persona.id as PersonaId]}
          </div>
          <div>
            <h3
              style={{ fontFamily: "var(--font-cormorant), Cormorant, serif" }}
              className="text-[18px] font-[300] text-[#1A1510] leading-tight"
            >
              {persona.name}
            </h3>
            <p
              style={{
                fontFamily: "var(--font-mono), IBM Plex Mono, monospace",
              }}
              className="text-[9px] text-[#767676] uppercase tracking-widest font-bold"
            >
              {personaSanskrit[persona.id as PersonaId]}
            </p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-2">
          {isSpeaking && (
            <div className="flex gap-1">
              <div className="w-1 h-1 bg-[#9B1C1C] animate-bounce [animation-delay:-0.3s]" />
              <div className="w-1 h-1 bg-[#9B1C1C] animate-bounce [animation-delay:-0.15s]" />
              <div className="w-1 h-1 bg-[#9B1C1C] animate-bounce" />
            </div>
          )}
          {isDone && <div className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />}
        </div>
      </div>

      <div className="flex-1 flex flex-col p-6">
        {isWaiting && !hasContent && (
          <div className="flex-1 flex items-center justify-center">
            <p
              style={{ fontFamily: "var(--font-cormorant), Cormorant, serif" }}
              className="text-[14px] text-[#767676] italic"
            >
              The voice is observing the council...
            </p>
          </div>
        )}

        {isSpeaking && !hasContent && (
          <div className="flex-1 flex flex-col items-center justify-center gap-4">
            <div className="w-8 h-8 border border-[#E8E3DC] border-t-[#9B1C1C] animate-spin rounded-full" />
            <p
              style={{
                fontFamily: "var(--font-mono), IBM Plex Mono, monospace",
              }}
              className="text-[9px] text-[#9B1C1C] uppercase tracking-widest font-bold"
            >
              SPEAKING...
            </p>
          </div>
        )}

        {hasContent && (
          <div className="flex-1 flex flex-col">
            {source && quote && (
              <div className="mb-4 p-4 bg-[#F5F2EC] border border-[#E8E3DC] relative rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className={`w-1 h-1 rounded-full ${getSourceDotColor(source)}`}
                  />
                  <span
                    style={{
                      fontFamily: "var(--font-mono), IBM Plex Mono, monospace",
                    }}
                    className="text-[8px] text-[#767676] uppercase font-bold"
                  >
                    REBUTTING {source}
                  </span>
                </div>
                <p
                  style={{
                    fontFamily: "var(--font-cormorant), Cormorant, serif",
                  }}
                  className="text-[13px] text-[#1A1510] italic leading-relaxed line-clamp-2"
                >
                  &ldquo;{quote}&rdquo;
                </p>
              </div>
            )}

            <div className="flex-1">
              {summaryLoading && (
                <div className="flex items-center gap-2 py-2 mb-4">
                  <div className="w-1 h-1 rounded-full bg-[#9B1C1C] animate-pulse" />
                  <span
                    style={{
                      fontFamily: "var(--font-mono), IBM Plex Mono, monospace",
                    }}
                    className="text-[9px] text-[#767676] uppercase tracking-wide"
                  >
                    Rendering summary...
                  </span>
                </div>
              )}

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
                    <MarkdownRenderer content={body} />
                  </div>
                  {summary && expanded && (
                    <button
                      onClick={() => setExpanded(false)}
                      style={{
                        fontFamily:
                          "var(--font-mono), IBM Plex Mono, monospace",
                      }}
                      className="text-[9px] uppercase tracking-widest font-medium text-[#9B1C1C] hover:underline transition-colors mt-2"
                    >
                      Show summary ↑
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {hasError && (
          <div className="flex-1 flex items-center justify-center p-6 bg-red-50 border border-red-100 rounded-xl">
            <p className="text-[12px] text-red-600 font-medium">
              The voice has been silenced by an error.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
