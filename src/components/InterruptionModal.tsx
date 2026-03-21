import { useState } from "react";
import { Persona, PersonaId } from "@/types/council";
import { PERSONAS } from "@/lib/prompts";
import { ShieldAlert, Sparkles, Anchor, Shuffle } from "lucide-react";
import MarkdownRenderer from "@/components/MarkdownRenderer";

interface InterruptionModalProps {
  personaId: PersonaId;
  question: string;
  onAnswer: (answer: string) => void;
  onSkip: () => void;
}

const personaIcons: Record<PersonaId, React.ReactNode> = {
  skeptic: <ShieldAlert className="w-4 h-4" />,
  optimist: <Sparkles className="w-4 h-4" />,
  pragmatist: <Anchor className="w-4 h-4" />,
  "devils-advocate": <Shuffle className="w-4 h-4" />,
};

export default function InterruptionModal({
  personaId,
  question,
  onAnswer,
  onSkip,
}: InterruptionModalProps) {
  const [answer, setAnswer] = useState("");
  const persona = PERSONAS.find((p) => p.id === personaId) as Persona;
  const icon = personaIcons[personaId];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-6 pb-20">
      <div
        className="absolute inset-0 bg-[#1A1510]/40 backdrop-blur-sm"
        onClick={onSkip}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-lg bg-white border border-[#E8E3DC] p-8 md:p-10 flex flex-col gap-6 shadow-xl rounded-2xl">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-10 h-10 border border-[#E8E3DC] bg-[#F5F2EC] text-[#9B1C1C]">
            {icon}
          </div>
          <div>
            <p
              style={{
                fontFamily: "var(--font-mono), IBM Plex Mono, monospace",
              }}
              className="text-[9px] font-bold tracking-[0.2em] text-[#767676] uppercase"
            >
              {persona.name} ASKS
            </p>
          </div>
        </div>

        <div className="relative">
          <div
            style={{ fontFamily: "var(--font-cormorant), Cormorant, serif" }}
            className="text-[#1A1510] text-xl md:text-2xl italic leading-[1.35] tracking-tight border-l-2 border-[#9B1C1C]/30 pl-6"
          >
            <MarkdownRenderer content={question.replace(/^"|"$/g, "")} />
          </div>
        </div>

        <div>
          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="How will you respond?"
            style={{ fontFamily: "var(--font-dm-sans), DM Sans, sans-serif" }}
            className="w-full bg-[#F5F2EC] border border-[#E8E3DC] p-5 text-[15px] text-[#1A1510] placeholder:text-[#767676] focus:outline-none focus:border-[#9B1C1C] transition-all resize-none h-28"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => onAnswer(answer)}
            disabled={!answer.trim()}
            style={{ fontFamily: "var(--font-mono), IBM Plex Mono, monospace" }}
            className="flex-1 bg-[#1A1510] text-white py-4 text-[11px] font-bold uppercase tracking-widest transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#9B1C1C]"
          >
            ANSWER & CONTINUE →
          </button>
          <button
            onClick={onSkip}
            style={{ fontFamily: "var(--font-mono), IBM Plex Mono, monospace" }}
            className="flex-1 py-4 text-[11px] font-bold uppercase tracking-widest border border-[#E8E3DC] text-[#767676] hover:bg-[#F5F2EC] transition-all"
          >
            SKIP
          </button>
        </div>
      </div>
    </div>
  );
}
