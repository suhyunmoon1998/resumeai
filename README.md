# ☁️ VoiceResume

**Just talk. Watch it write itself.**

Sign in with Google, pick your school or company, answer 9–12 AI voice interview questions, and get a polished resume + QR business card. Card backgrounds use your school's official colors with watermark, pattern, or minimal styles.

## Stack

- **Next.js 14** (App Router, TypeScript)
- **Tailwind CSS**
- **Supabase** (Auth, PostgreSQL, Storage) with Google OAuth
- **Anthropic Claude API** (`claude-sonnet-4-6`)
- **Web Speech API** (voice input + TTS)
- **docx** (resume export) / **qrcode** (QR generation)

## Setup

### 1. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. **Authentication → Providers → Google** → enable and add Google OAuth credentials.
   Redirect URL: `https://[project].supabase.co/auth/v1/callback`
3. **SQL Editor** → run `supabase/migrations/001_init.sql` (creates tables, RLS policies, profile trigger, and seeds ~27 schools/companies)
4. **Storage** → new bucket `card-images` (public read)
5. **Storage** → new bucket `resumes` (private)

### 2. Environment

```bash
cp .env.example .env.local
```

Fill in:

```bash
NEXT_PUBLIC_SUPABASE_URL=        # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=   # Supabase anon key
SUPABASE_SERVICE_ROLE_KEY=       # Supabase service role key (server only)
ANTHROPIC_API_KEY=               # console.anthropic.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

> Voice input requires Chrome or Edge on desktop/Android (Web Speech API). Other browsers can type answers instead.

## App flow

1. **Landing** (`/`) — Google sign-in, redirects to `/dashboard` when logged in
2. **Dashboard** (`/dashboard`) — saved resumes, school picker, "+ New Resume"
3. **Interview** (`/interview`) — pick one of 9 roles → voice interview with animated cloud interviewer and live resume preview → AI template recommendation across 10 templates → DOCX download → business card designer (6 presets / school colors / draw mode) → QR share page
4. **Public card** (`/card/[slug]`) — shareable card page with QR, `.vcf` download, and view counter

## Project structure

```
app/            pages + API routes (claude proxy, resume, card, auth callback)
components/     auth, interview, resume, card, school, ui
lib/            supabase clients, claude, questions, templates,
                buildDocx, buildVcard, buildCardImage, schools, speech
supabase/       migrations/001_init.sql
types/          shared TypeScript types
```
