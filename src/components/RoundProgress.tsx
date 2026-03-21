"use client";

interface RoundProgressProps {
  currentRound: number;
}

const steps = [
  { number: 1, label: "Pratham Paksha" },
  { number: 2, label: "Khandana" },
  { number: 3, label: "Nirnaya" },
];

export default function RoundProgress({ currentRound }: RoundProgressProps) {
  return (
    <div className="flex items-center justify-center gap-1.5 sm:gap-2 flex-1 min-w-0">
      {steps.map((step, idx) => {
        const isCompleted = currentRound > step.number;
        const isActive = currentRound === step.number;

        return (
          <div
            key={step.number}
            className="flex items-center gap-1 sm:gap-1.5 min-w-0"
          >
            <div
              style={{
                fontFamily: "var(--font-mono), IBM Plex Mono, monospace",
              }}
              className={`flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-[11px] uppercase tracking-[0.15em] font-bold transition-colors duration-300 truncate ${
                isActive
                  ? "text-[#9B1C1C]"
                  : isCompleted
                    ? "text-[#1A1510]"
                    : "text-[#767676]/40"
              }`}
            >
              <div
                className={`w-1.5 h-1.5 shrink-0 transition-colors duration-300 rounded-full ${
                  isActive
                    ? "bg-[#9B1C1C] shadow-[0_0_8px_rgba(155,28,28,0.4)]"
                    : isCompleted
                      ? "bg-[#1A1510]"
                      : "bg-[#767676]/20"
                }`}
              />
              <span className="hidden sm:inline">{step.label}</span>
              <span className="sm:hidden">{step.number}</span>
            </div>
            {idx < steps.length - 1 && (
              <div
                className={`w-4 h-px shrink-0 transition-colors duration-300 ${
                  isCompleted ? "bg-[#E8E3DC]" : "bg-[#E8E3DC]/50"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
