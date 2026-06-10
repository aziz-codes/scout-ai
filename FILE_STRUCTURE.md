# Project File Structure & Purpose

## Directory Tree

```
scoutai/
│
├── 📄 ALERTS_README.md                      # Quick start reference (READ THIS FIRST)
├── 📄 ALERTS_SETUP.md                       # Complete setup guide with screenshots
├── 📄 IMPLEMENTATION.md                     # Architecture & technical deep dive
├── 📄 DEPLOYMENT_CHECKLIST.md               # Pre-launch checklist
├── 📄 FILE_STRUCTURE.md                     # This file
│
├── 📁 app/
│   ├── 📁 api/
│   │   ├── 📁 alerts/
│   │   │   └── route.ts                    # ⭐ POST /api/alerts - Create user alert
│   │   │                                    #   + GET /api/alerts?email=... - Get alert
│   │   │
│   │   ├── 📁 check-alerts/
│   │   │   └── route.ts                    # ⭐ POST /api/check-alerts - Cron processor
│   │   │                                    #   Fetches matches, sends alerts
│   │   │
│   │   └── 📁 analysis/
│   │       └── route.ts                    # Existing analysis endpoint
│   │
│   ├── 📁 notifications/
│   │   └── page.tsx                        # ⭐ /notifications page
│   │                                        #   Renders NotificationAlertsBuilder
│   │
│   ├── 📁 fixtures/
│   │   └── page.tsx                        # Existing fixtures page
│   │
│   ├── globals.css                         # Global styles (dark theme)
│   ├── layout.tsx                          # Root layout
│   └── page.tsx                            # Home page
│
├── 📁 components/
│   ├── 📁 notifications/
│   │   ├── NotificationAlertsBuilder.tsx  # ⭐ Alert creation component
│   │   │                                   #   - Team search/selection (2 max)
│   │   │                                   #   - Email input
│   │   │                                   #   - Create alert button
│   │   │                                   #   - Success/error messages
│   │   │
│   │   └── index.ts                       # Export NotificationAlertsBuilder
│   │
│   ├── 📁 fixtures/
│   │   └── *.tsx                          # Existing fixture components
│   │
│   ├── 📁 layout/
│   │   ├── AppHeader.tsx                  # Header with logo
│   │   ├── BottomNav.tsx                  # Navigation tabs (including Alerts)
│   │   └── index.ts
│   │
│   ├── 📁 matches/
│   │   └── *.tsx                          # Existing match components
│   │
│   ├── 📁 standings/
│   │   └── *.tsx                          # Existing standings components
│   │
│   └── 📁 ui/
│       ├── Badge.tsx                      # UI component
│       ├── Card.tsx                       # UI component
│       ├── SectionHeader.tsx              # UI component
│       └── index.ts
│
├── 📁 lib/
│   ├── supabase.ts                        # ⭐ Supabase client initialization
│   │                                       #   - Connects to Supabase via env vars
│   │                                       #   - Exports single `supabase` instance
│   │
│   ├── db.ts                              # ⭐ Database helper functions
│   │                                       #   - createOrUpdateUser()
│   │                                       #   - getUsersByTeams()
│   │                                       #   - checkNotificationExists()
│   │                                       #   - insertNotification()
│   │                                       #   - getUserByEmail()
│   │
│   ├── api.ts                             # API utility functions
│   │                                       #   - fetchGames()
│   │                                       #   - extractTeamsFromGames()
│   │                                       #   - TEAM_INFO mapping
│   │
│   ├── utils.ts                           # Utility functions (cn, etc)
│   └── country-flags.ts                   # Flag utilities
│
├── 📁 types/
│   └── index.ts                           # TypeScript types
│                                           # + AlertTeam
│                                           # + TeamAlert
│
├── 📁 data/
│   └── index.ts                           # Static data
│                                           # - NAV_ITEMS (updated with Alerts tab)
│                                           # - MATCHES, FIXTURES, etc.
│
├── 📁 public/
│   └── (static assets)
│
├── 📁 supabase/
│   └── 📁 migrations/
│       └── 001_create_alerts_schema.sql   # ⭐ Database schema
│                                           #   - CREATE TABLE users
│                                           #   - CREATE TABLE notifications
│                                           #   - CREATE INDEXES
│
├── 📄 .env.local.example                  # ⭐ Environment variable template
│                                           #   Copy to .env.local and fill in
│
├── 📄 .env.local                          # (NOT IN GIT) - Your actual env vars
├── 📄 .gitignore                          # Excludes .env.local, node_modules
├── 📄 package.json                        # ⭐ Updated dependencies
│                                           # + @supabase/supabase-js
│                                           # + resend (already had)
│                                           # - @sendgrid/mail (removed)
│                                           # - nodemailer (removed)
│
├── 📄 tsconfig.json                       # TypeScript config
├── 📄 next.config.ts                      # Next.js config
├── 📄 eslint.config.mjs                   # ESLint config
├── 📄 tailwind.config.ts                  # Tailwind config
├── 📄 postcss.config.mjs                  # PostCSS config
│
├── 📄 README.md                           # Original project readme
├── 📄 AGENTS.md                           # Agent instructions
├── 📄 CLAUDE.md                           # Claude-specific instructions
│
└── 📄 setup-alerts.sh                     # Optional setup script

```

## File Purposes by Feature

### User Creates Alert Flow

```
NotificationAlertsBuilder.tsx
  ↓ User enters email + selects 2 teams
  ↓ Click "Create Alert"
  ↓
POST /api/alerts
  ↓ Import createOrUpdateUser from lib/db.ts
  ↓ createOrUpdateUser() connects to Supabase
  ↓ Save to users table
  ↓ Send confirmation email via Resend
  ↓ Return success response
```

### Cron Job Sends Alerts Flow

```
External Cron Service
  ↓ Every 30 minutes
  ↓
POST /api/check-alerts
  ↓ Import fetchGames from lib/api.ts
  ↓ Get all World Cup matches
  ↓ Loop through matches
  ↓   For each match:
  ↓   - Import getUsersByTeams from lib/db.ts
  ↓   - Find users whose teams match
  ↓   - For each user:
  ↓     - checkNotificationExists() - prevent duplicates
  ↓     - If not sent: send email via Resend
  ↓     - insertNotification() - log to database
  ↓
Return: { success: true, sent: 5, ... }
```

## Key Dependencies

### Production Dependencies

```json
{
  "@supabase/supabase-js": "^2.45.0", // Database client
  "resend": "^6.12.4", // Email service
  "next": "16.2.7", // Web framework
  "react": "19.2.4", // UI library
  "lucide-react": "^1.17.0" // Icons
}
```

### Removed Dependencies ✅

```
@sendgrid/mail     ✂️ Removed (using Resend only)
nodemailer         ✂️ Removed (using Resend only)
```

## Environment Variables

File: `.env.local` (create from `.env.local.example`)

```bash
# Supabase - Database
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Resend - Email
RESEND_API_KEY=re_...

# Cron Security (optional)
CRON_SECRET=your_secret_here
```

## Database Schema

File: `supabase/migrations/001_create_alerts_schema.sql`

### users table

```sql
Column          | Type      | Notes
─────────────────────────────────────
id              | UUID      | Primary key
email           | TEXT      | Unique, indexed
teams           | JSONB     | Array of team objects
created_at      | TIMESTAMP | Defaults to now()
updated_at      | TIMESTAMP | Defaults to now()
```

### notifications table

```sql
Column          | Type      | Notes
─────────────────────────────────────
id              | UUID      | Primary key
user_id         | UUID      | Foreign key → users.id
match_id        | TEXT      | Indexed
type            | TEXT      | pre-match | live | ended
sent_at         | TIMESTAMP | Defaults to now()
created_at      | TIMESTAMP | Defaults to now()

Unique Constraint: (user_id, match_id, type)
```

## TypeScript Types

File: `types/index.ts`

```typescript
interface AlertTeam {
  name: string; // "Brazil"
  flag: string; // "🇧🇷"
  code: string; // "BRA"
}

interface TeamAlert {
  id: string;
  email: string;
  teams: AlertTeam[];
  createdAt: string;
  active: boolean;
}
```

## API Routes Summary

### 1. POST /api/alerts

**Purpose**: Create or update user alert  
**Auth**: None (public, but add rate limiting)  
**Files**: `app/api/alerts/route.ts`  
**Imports**: `lib/db.ts`, `resend`

### 2. GET /api/alerts

**Purpose**: Retrieve user's alert  
**Auth**: Optional  
**Query**: `?email=user@example.com`  
**Files**: `app/api/alerts/route.ts`

### 3. POST /api/check-alerts

**Purpose**: Cron processor to send alerts  
**Auth**: Bearer token in Authorization header  
**Files**: `app/api/check-alerts/route.ts`  
**Imports**: `lib/api.ts`, `lib/db.ts`, `resend`

## Documentation Files

| File                    | Purpose            | Audience     |
| ----------------------- | ------------------ | ------------ |
| ALERTS_README.md        | Quick reference    | Everyone     |
| ALERTS_SETUP.md         | Step-by-step setup | DevOps/Setup |
| IMPLEMENTATION.md       | Technical details  | Engineers    |
| DEPLOYMENT_CHECKLIST.md | Pre-launch         | QA/DevOps    |
| FILE_STRUCTURE.md       | This file          | Everyone     |

## Development Workflow

1. **Install**: `npm install`
2. **Environment**: Create `.env.local`
3. **Database**: Run SQL migration in Supabase
4. **Start**: `npm run dev`
5. **Test**: Visit `/notifications`
6. **Deploy**: Follow `DEPLOYMENT_CHECKLIST.md`

## Common Tasks

### Add New Team

File: `lib/api.ts` → `TEAM_INFO` object

```typescript
"Country Name": { flag: "🏴", code: "XXX" }
```

### Change Email Template

File: `app/api/alerts/route.ts` → `buildEmailHtml()` function

### Adjust Cron Schedule

File: `vercel.json` → `crons.schedule`  
Format: `"*/30 * * * *"` (cron expression)

### Add Database Field

1. Create migration in `supabase/migrations/`
2. Run in Supabase SQL Editor
3. Update types in `types/index.ts`
4. Update functions in `lib/db.ts`

## Security Notes

- ✅ Never commit `.env.local`
- ✅ Service role key is server-side only
- ✅ Public API endpoints should have rate limiting
- ✅ Cron job requires secret token
- ✅ All database operations use parameterized queries (Supabase handles this)

## Performance Considerations

- **Indexes**: Email, match_id, user_id for fast lookups
- **Unique Constraint**: Prevents duplicate notifications
- **Batch Processing**: Cron processes all matches in one run
- **Estimated**: 500k emails/day on moderate hardware

---

**Last Updated**: June 10, 2026  
**System Version**: 1.0.0
