# Match Alerts System - Setup & Implementation Guide

This guide explains how to set up the production-ready match alerts system using Supabase and Resend.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend (Next.js)                       │
│  NotificationAlertsBuilder Component → /api/alerts (POST)       │
└─────────────────┬───────────────────────────────────────────────┘
                  │ User submits email + 2 teams
                  │
┌─────────────────▼───────────────────────────────────────────────┐
│                  Backend API Routes                             │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ POST /api/alerts                                         │   │
│  │ • Validate input (email, 2 teams)                        │   │
│  │ • Save/update user in Supabase                           │   │
│  │ • Send confirmation email via Resend                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ POST /api/check-alerts (Cron Job)                        │   │
│  │ • Fetch matches from World Cup API                       │   │
│  │ • Find users with matching teams                         │   │
│  │ • Check for duplicates (prevent double emails)           │   │
│  │ • Send alerts via Resend                                 │   │
│  │ • Log notifications to Supabase                          │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────┬───────────────────────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────────────────────┐
│                   Supabase (PostgreSQL)                         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ users table                                              │   │
│  │ • id (UUID)                                              │   │
│  │ • email (string, unique)                                 │   │
│  │ • teams (JSON array)                                     │   │
│  │ • created_at, updated_at (timestamps)                    │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ notifications table                                      │   │
│  │ • id (UUID)                                              │   │
│  │ • user_id (FK to users)                                  │   │
│  │ • match_id (string)                                      │   │
│  │ • type (pre-match | live | ended)                        │   │
│  │ • sent_at, created_at (timestamps)                       │   │
│  │ UNIQUE: (user_id, match_id, type) ← Deduplication!      │   │
│  └──────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Wait for provisioning to complete
4. Go to **Settings → API** and copy:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY` (not the anon key!)

## Step 2: Run Database Migrations

1. In Supabase dashboard, go to **SQL Editor**
2. Click **Create new query**
3. Copy the entire SQL from `supabase/migrations/001_create_alerts_schema.sql`
4. Run the query
5. Verify tables were created: You should see `users` and `notifications` tables

## Step 3: Set Up Resend

1. Go to [resend.com](https://resend.com)
2. Create a free account or sign in
3. Create a new API key
4. Add your domain to **Sending Domain** (or use `resend.dev` for testing)
5. Copy the API key

## Step 4: Configure Environment Variables

1. Create `.env.local` in project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# Resend Configuration
RESEND_API_KEY=your_resend_api_key_here

# Optional: For cron job security
CRON_SECRET=your_secret_string_here
```

2. **Never commit** `.env.local` to git!
3. Add to `.gitignore` if not already there

## Step 5: Install Dependencies

```bash
npm install @supabase/supabase-js resend
npm remove @sendgrid/mail nodemailer  # Remove unused libraries
```

## Step 6: Test the Alert Creation Flow

### Option A: Using the UI

1. Start dev server: `npm run dev`
2. Navigate to `/notifications`
3. Select 2 teams
4. Enter your email
5. Click "Create Alert"
6. Check your email for confirmation

### Option B: Using API Directly

```bash
curl -X POST http://localhost:3000/api/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "teams": [
      {"name": "Brazil", "flag": "🇧🇷", "code": "BRA"},
      {"name": "Germany", "flag": "🇩🇪", "code": "GER"}
    ]
  }'
```

## Step 7: Set Up Cron Job

The `/api/check-alerts` endpoint must be called periodically to send match notifications.

### Option A: Vercel Cron (Recommended)

Add to `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/check-alerts",
      "schedule": "*/30 * * * *"
    }
  ]
}
```

### Option B: GitHub Actions

Create `.github/workflows/check-alerts.yml`:

```yaml
name: Check Match Alerts
on:
  schedule:
    - cron: "*/30 * * * *" # Every 30 minutes

jobs:
  check:
    runs-on: ubuntu-latest
    steps:
      - name: Trigger check-alerts
        run: |
          curl -X POST ${{ secrets.SITE_URL }}/api/check-alerts \
            -H "Authorization: Bearer ${{ secrets.CRON_SECRET }}" \
            -H "Content-Type: application/json"
```

### Option C: External Service (e.g., EasyCron)

1. Go to [easycron.com](https://www.easycron.com)
2. Create a new cron job
3. Set URL: `https://yoursite.com/api/check-alerts`
4. Set schedule: Every 30 minutes
5. Add header: `Authorization: Bearer <CRON_SECRET>`

## Step 8: Test the Cron Job

```bash
curl -X POST http://localhost:3000/api/check-alerts \
  -H "Authorization: Bearer your_cron_secret" \
  -H "Content-Type: application/json"
```

Expected response:

```json
{
  "success": true,
  "message": "Alert check completed",
  "processed": 12,
  "sent": 3,
  "results": [...]
}
```

## File Structure

```
scoutai/
├── app/
│   ├── api/
│   │   ├── alerts/
│   │   │   └── route.ts                 ← Create/update user alerts
│   │   └── check-alerts/
│   │       └── route.ts                 ← Cron job for sending alerts
│   ├── notifications/
│   │   └── page.tsx                     ← User-facing alerts page
│   └── ...
├── components/
│   └── notifications/
│       ├── NotificationAlertsBuilder.tsx ← Alert creation UI
│       └── index.ts
├── lib/
│   ├── supabase.ts                      ← Supabase client initialization
│   ├── db.ts                            ← Database helper functions
│   ├── api.ts                           ← World Cup API + team extraction
│   └── ...
├── supabase/
│   └── migrations/
│       └── 001_create_alerts_schema.sql ← Database schema
├── .env.local                           ← Environment variables (NOT in git!)
├── .env.local.example                   ← Example template
└── package.json
```

## Database Functions Reference

### lib/db.ts

```typescript
// Create or update user with teams
createOrUpdateUser(email: string, teams: AlertTeam[])

// Get users whose teams match the given teams
getUsersByTeams(homeTeam: string, awayTeam: string)

// Check if notification was already sent
checkNotificationExists(userId: string, matchId: string, type: string)

// Insert notification record after successful email
insertNotification(userId: string, matchId: string, type: string)

// Get user by email
getUserByEmail(email: string)
```

## API Routes Reference

### POST /api/alerts

**Request:**

```json
{
  "email": "user@example.com",
  "teams": [
    { "name": "Brazil", "flag": "🇧🇷", "code": "BRA" },
    { "name": "Germany", "flag": "🇩🇪", "code": "GER" }
  ]
}
```

**Response (201):**

```json
{
  "success": true,
  "message": "Alert created! Check your email for confirmation.",
  "userId": "uuid-here"
}
```

### GET /api/alerts?email=user@example.com

**Response:**

```json
{
  "user": {
    "id": "uuid-here",
    "email": "user@example.com",
    "teams": [...]
  }
}
```

### POST /api/check-alerts

**Headers:**

```
Authorization: Bearer <CRON_SECRET>
Content-Type: application/json
```

**Response:**

```json
{
  "success": true,
  "message": "Alert check completed",
  "processed": 12,
  "sent": 5,
  "results": [
    {
      "matchId": "match-123",
      "teams": "Brazil vs Germany",
      "usersSent": 3,
      "skipped": 1
    }
  ]
}
```

## Troubleshooting

### "Missing Supabase environment variables"

- Check `.env.local` has both `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Restart dev server after adding env vars

### "Failed to send confirmation email"

- Verify `RESEND_API_KEY` is correct
- Check Resend dashboard for API usage/errors
- Ensure "from" email domain is verified in Resend

### "No users found" when checking alerts

- Verify users exist in Supabase `users` table
- Check that team codes in database match API team names

### Duplicate emails being sent

- The `notifications` table unique constraint prevents duplicates
- If duplicates still occur, check that the cron job isn't running simultaneously

## Security Considerations

1. **Environment Variables**: Never commit `.env.local` to git
2. **Service Role Key**: Only use in backend code, never expose to frontend
3. **Cron Secret**: Protect with `CRON_SECRET` header validation
4. **RLS Policies**: Configure Row Level Security in Supabase for production
5. **Email Validation**: Always validate email format on both frontend and backend
6. **Rate Limiting**: Consider adding rate limits to `/api/alerts` endpoint

## Performance Tips

1. **Database Indexes**: Already created on email and match_id for fast lookups
2. **Batch Processing**: The cron job processes all matches in one run
3. **Deduplication**: Prevents unnecessary emails and database operations
4. **Caching**: Consider caching team data on the frontend (localStorage)

## Next Steps

1. ✅ Set up Supabase project and run migrations
2. ✅ Create Resend account and API key
3. ✅ Add environment variables
4. ✅ Test alert creation flow
5. ✅ Set up cron job
6. ✅ Monitor email sending in Resend dashboard
7. Deploy to production
8. Monitor logs for errors
9. Iterate on email templates

## Support

- Supabase docs: https://supabase.com/docs
- Resend docs: https://resend.com/docs
- Next.js docs: https://nextjs.org/docs
