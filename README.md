# Varant — The Ancient Council

> *"What bet can't you undo?"*

**Track:** Open Innovation
**Team:** Syntax Terror — KCC Institute of Technology & Management
**Members:** Yash Panchal · Shivam Kumar · Shambhavi Mishra · Shubhanshu Singh
**Live Demo:** [varant.ai](https://varant-ai.vercel.app/)

---

## Problem Statement

Every founder faces decisions they cannot undo — quit or stay, raise or bootstrap, pivot or persist. These are not ordinary choices. They are irreversible bets made under financial pressure, emotional exhaustion, and incomplete information.

Today, founders make these decisions alone. They post in WhatsApp groups, ask ChatGPT, scroll Twitter at 2am. None of these give them what they actually need: **structured deliberation**.

ChatGPT gives one confident answer. Roundtable shows four answers side by side. But no tool forces those perspectives to *argue* — to challenge each other, expose contradictions, and arrive at a verdict through conflict.

This gap is not new. Ancient India solved it 2,500 years ago with the **Sabha** — a council of deliberate voices trained to argue from opposing positions until truth emerged. The Nyaya and Mimamsa schools of philosophy formalized this into a structured debate: first position, rebuttal, final verdict.

No modern decision tool has applied this framework. Varant does.

**Affected users:** Early-stage founders, 18–35, making high-stakes irreversible decisions with no structured support system. Estimated 50M+ globally.

---

## Solution

Varant is an AI-powered Sabha — a council of four named personas who debate your decision across three structured rounds before delivering a final verdict.

### The Four Voices

| Persona | Sanskrit | Role | Model |
|---------|----------|------|-------|
| **Vitarka** | वितर्क | Skeptic — destroys assumptions | Gemini Flash |
| **Asha** | आशा | Optimist — argues for upside | GPT-4.1 Nano |
| **Yukti** | युक्ति | Pragmatist — delivers milestones | Qwen 3.5 Flash |
| **Vipaksha** | विपक्ष | Devil's Advocate — the opposition | Gemini Flash Lite |

### The Three Rounds

1. **Pratham Paksha** (प्रथम पक्ष) — All four voices respond simultaneously. Raw, unfiltered first positions.
2. **Khandana** (खण्डन) — Voices see each other's responses and directly rebut. Arguments fracture and reform.
3. **Nirnaya** (निर्णय) — A Chairman LLM synthesizes all debate into a final verdict with confidence score.

### The Prashna (Interruption)
Mid-session, the user can challenge any voice directly. Their interjection is folded into the Khandana round — forcing that voice to respond.

### The Shastra (Decision Record)
Every session produces a permanent structured memo:
- **Consensus Points** — what all voices agreed on
- **Key Tensions** — where voices fundamentally disagreed
- **Recommendation** — the actionable verdict
- **Matra** — confidence score (0–100%)
- **The Unseen** — risks the user didn't mention but the Sabha detected

---

## Technical Architecture

```
User Input (Decision + Context)
        │
        ▼
┌───────────────────────────────┐
│     Next.js 14 App Router     │
│     TypeScript + TailwindCSS  │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│        OpenRouter API         │
│  Multi-model routing layer    │
└──┬──────┬──────┬──────┬───────┘
   │      │      │      │
   ▼      ▼      ▼      ▼
Gemini  GPT-4  Qwen  Gemini
Flash   Nano  Flash   Lite
(Vitarka)(Asha)(Yukti)(Vipaksha)
   │      │      │      │
   └──────┴──────┴──────┘
                │
                ▼
      Streaming to client
      (Server-Sent Events)
                │
                ▼
        Khandana Round
   (models see each other)
                │
                ▼
        Chairman LLM
        (Nirnaya synthesis)
                │
                ▼
         Shastra Output
```

**Stack:** Next.js 14 · TypeScript · TailwindCSS · Shadcn UI · OpenRouter API
**Cost per session:** ~$0.0006 (≈1,666 full Vichaars per dollar)
**Streaming:** Real-time token streaming via Server-Sent Events

---

## Setup & Running Locally

```bash
# 1. Clone the repo
git clone https://github.com/[team-repo]/varant
cd varant

# 2. Install dependencies
npm install

# 3. Add environment variables
cp .env.example .env.local
# Add your OpenRouter API key:
# OPENROUTER_API_KEY=sk-or-...

# 4. Run development server
npm run dev

# 5. Open in browser
# http://localhost:3000
```

**To run a full demo:**
1. Open `localhost:3000`
2. Type any decision in the main input (example below)
3. Add context in the second field
4. Click "Begin your Vichar"
5. Watch Pratham Paksha stream live
6. Click "Proceed to Khandana"
7. Interject using the Prashna bar (optional)
8. Click "Render the Nirnaya"

**Example decision for judges:**
> *"Should I leave my startup and take a ₹8 LPA job offer, or keep building for one more year?"*

**Example context:**
> *"21 years old. Final year engineering. No revenue yet but working product. Hackathon next week. Parents want stability. Co-founders depending on me."*

---

## User Validation

We conducted structured interviews with 3 users outside the team:

**User 1 — 3rd year CS student, Delhi**
> "I've been going back and forth on this for weeks. Vitarka said exactly what my parents say. But Vipaksha asked something nobody asked me — can the company I'm joining become my first client? That reframe changed everything."

**User 2 — Early-stage founder, Bangalore**
> "ChatGPT always hedges. This actually took a side. 70% — take the internship. I don't agree, but now I know exactly why I disagree."

**User 3 — Product Manager, Delhi NCR**
> "The Khandana round is where it gets interesting. Watching Asha and Vitarka argue at each other with my actual decision as the subject — genuinely unsettling in the best way."

**Key insight from interviews:** Users don't want AI to decide for them. They want AI to surface the argument they haven't had yet. Varant's debate format — not Q&A — is what enables this.

---

## Deployment Path

**Who uses it:**
- Early-stage founders (18–35) facing irreversible decisions
- Product managers running strategy sessions
- B2B: startup teams, VC portfolio companies

**How it reaches them:**
- X (Twitter) launch post referencing Andrej Karpathy's llm-council
- ProductHunt launch post-hackathon
- Direct outreach to Indian founder communities (IndiaHacks, YC India alumni)

**Next 3 development milestones:**

| Milestone | Timeline | Description |
|-----------|----------|-------------|
| **Smriti** | Month 1–2 | Decision history — every Shastra saved, searchable, reviewable |
| **Mobile + Auth** | Month 2–3 | iOS/Android app, user accounts, shareable Shastras |
| **B2B Team Sabhas** | Month 4–6 | Multiple users in one Sabha session, team decision records |

---

## Privacy & Ethics

- **No decision data stored** — sessions are stateless; nothing persists server-side
- **No PII collected** — no login required in current version
- **OpenRouter API** — all model calls governed by OpenRouter's privacy policy; providers do not train on API inputs by default
- **Sensitive decisions** — Varant includes a disclaimer that it is a deliberation tool, not professional advice (legal, medical, financial)
- **No manipulation** — personas argue fixed philosophical positions, not optimized for any outcome

---

## Key Design Decisions

1. **Named personas over generic models** — "Vitarka" is more memorable and trustworthy than "Gemini Flash." Identity creates accountability.
2. **3 structured rounds over freeform chat** — Structure forces completion. Users can't exit before the Nirnaya without feeling they've abandoned the process.
3. **Sanskrit terminology throughout** — Not cosmetic. It signals that this is a different kind of thinking tool — not another Western chat interface.
4. **Streaming responses** — Watching voices "think" in real time creates the feeling of a live debate. Batch responses would kill the experience.
5. **Matra confidence score** — A number anchors the verdict. "70%" is more actionable than "we recommend."

---

## Repo Structure

```
varant/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Input screen
│   │   ├── council/page.tsx      # Debate screen
│   │   ├── verdict/page.tsx      # Nirnaya screen
│   │   └── api/council/route.ts  # OpenRouter API handler
│   ├── components/
│   │   ├── PersonaCard.tsx
│   │   ├── TensionMeter.tsx
│   │   ├── InterjectionBar.tsx
│   │   ├── VerdictCard.tsx
│   │   └── MarkdownRenderer.tsx
│   ├── lib/
│   │   ├── prompts.ts            # System prompts for all personas
│   │   └── utils.ts
│   └── types/council.ts
├── .env.example
├── README.md
└── package.json
```

---

## The One-Line Pitch

*"2,500 years ago, Indian kings had a Sabha before every irreversible decision. We're giving founders their Sabha back."*

---

*Built in 2 weeks. Rooted in Nyaya. Submitted to HackIndia Spark 4.*
*#kccitm #voyagers #hackindia*
