# ScoutAI — FIFA World Cup 2026

AI-powered match predictions, odds, standings, and fantasy lineup builder for the 2026 FIFA World Cup. Built with Next.js 16, TypeScript, Tailwind CSS v4, and the Anthropic Claude API.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.example .env.local
# → Open .env.local and add your ANTHROPIC_API_KEY

# 3. Run development server
npm run dev

# 4. Open http://localhost:3000
```

---

## Project Structure

```
scoutai-next/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (fonts, header, nav)
│   ├── page.tsx                # / → Predictions
│   ├── fixtures/page.tsx       # /fixtures
│   ├── standings/page.tsx      # /standings
│   ├── fantasy/page.tsx        # /fantasy
│   └── api/analysis/route.ts   # POST /api/analysis (Anthropic streaming)
│
├── components/
│   ├── ui/                     # Reusable primitives
│   │   ├── Badge.tsx
│   │   ├── Card.tsx
│   │   └── SectionHeader.tsx
│   ├── layout/                 # App shell
│   │   ├── AppHeader.tsx
│   │   └── BottomNav.tsx
│   ├── matches/                # Match prediction components
│   │   ├── MatchCard.tsx       # Expandable card with odds + analysis
│   │   ├── WinProbBar.tsx      # 3-segment probability bar
│   │   ├── StatBars.tsx        # Head-to-head dual stat bars
│   │   └── AIAnalysisBlock.tsx # Streaming AI scout report
│   ├── predictions/
│   │   └── PaywallCard.tsx     # Monetization CTA
│   ├── fixtures/
│   │   ├── FixtureRow.tsx
│   │   └── FixtureGroupSection.tsx
│   ├── standings/
│   │   └── StandingsTable.tsx
│   └── fantasy/
│       ├── FantasyPlayerCard.tsx
│       └── FantasyLineupBuilder.tsx  # AI lineup + rationale
│
├── data/index.ts               # All static data (matches, fixtures, standings, players)
├── types/index.ts              # TypeScript interfaces
├── lib/utils.ts                # cn(), formatOdds(), daysUntil(), etc.
├── .env.example                # All required env variables documented
└── .env.local                  # Your local secrets (gitignored)
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | ✅ Yes | Get from [console.anthropic.com](https://console.anthropic.com/settings/api-keys) |
| `NEXT_PUBLIC_APP_URL` | No | App base URL (default: http://localhost:3000) |
| `NEXT_PUBLIC_TOURNAMENT_END` | No | ISO date for days-left counter (default: 2026-07-19) |
| `NEXT_PUBLIC_PAYWALL_ENABLED` | No | Toggle paywall UI |
| `STRIPE_SECRET_KEY` | No | For subscription billing |

---

## How the AI Works

Every match card has a **Load AI Analysis** button. When clicked:

1. The client POSTs the match-specific prompt to `/api/analysis`
2. The API route calls `claude-sonnet-4-20250514` with SSE streaming enabled
3. Tokens stream back in real time and are appended to the UI character by character
4. The Fantasy page uses the same pipeline for lineup rationale generation

The AI prompts are stored in `data/index.ts` — edit them to change the analysis style.

---

## Deploying to Vercel

```bash
npm i -g vercel
vercel
# Set ANTHROPIC_API_KEY in Vercel dashboard → Settings → Environment Variables
```

---

## Monetization Hooks

- **Paywall card** at the bottom of Predictions (unlock all 8 matches)
- **Pricing tiers**: Daily $2 / Full Tournament $19 — wire up Stripe with `STRIPE_SECRET_KEY`
- **Fantasy premium**: AI lineup builder can be gated behind auth

---

## Tech Stack

- **Next.js 16** — App Router, Server Components, API Routes
- **TypeScript** — strict mode, all types in `types/index.ts`
- **Tailwind CSS v4** — utility classes, no config file needed
- **Anthropic SDK** — `@anthropic-ai/sdk` with streaming
- **Lucide React** — icons
- **clsx + tailwind-merge** — conditional class merging via `cn()`
