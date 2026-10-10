# games.utility.forum 🎮⚡

Lightweight, ultra-fast browser games with dynamic synth soundtracks, global cloud leaderboards, and persistent player saves powered by Supabase, hosted on Vercel.

---

## 🚀 Features

- **Lightning Fast:** Pure Vanilla HTML5, modern CSS tokens, and JavaScript ES modules. Zero runtime bloat or multi-megabyte engine dependencies.
- **Web Audio Engine:** Built-in retro chiptune / synthwave procedural audio generator and tactile arcade SFX.
- **Cloud State & Leaderboards:** Ready for [Supabase](https://supabase.com) (PostgreSQL) with automatic `localStorage` offline fallback.
- **Vercel Optimized:** `vercel.json` configured for clean URLs, edge caching, and instant Git continuous deployment.
- **Custom Subdomain Ready:** Built for `games.utility.forum`.
- **Responsive & Mobile Ready:** Plays great on desktop, tablet, and mobile devices (includes virtual D-Pad touch controls).

---

## 📁 Repository Structure

```
d:/games utility forum/
├── index.html               # Main homepage & games arcade showcase
├── about.html               # About page (architecture, mission, roadmap)
├── privacy.html             # Privacy Policy (data handling, cloud sync, rights)
├── terms.html               # Terms of Service (fair play, leaderboards)
├── vercel.json              # Vercel deployment routing & headers
├── DEV_NOTES.md             # Continuous development session log
├── css/
│   └── style.css            # Dark arcade cyber design system
├── js/
│   ├── audio.js             # Web Audio API synth & SFX engine
│   ├── supabase-client.js   # Supabase cloud database & local fallback client
│   └── main.js              # Portal UI, filters, modal launcher, leaderboards
└── games/
    └── neon-snake/          # Playable starter game: Neon Snake 2049
        └── index.html
```

---

## 🛠️ Local Development & Testing

You can run this project locally with any static web server:

```powershell
# Using npx (Node.js)
npx serve .

# Or using Python 3
python -m http.server 8080
```

Open your browser at `http://localhost:8080` or `http://localhost:3000`.

---

## ☁️ Supabase Setup (Optional but Recommended)

1. Create a free account and new project at [supabase.com](https://supabase.com).
2. Open the **SQL Editor** in your Supabase dashboard and run the following script:

```sql
-- 1. Create Leaderboards Table
CREATE TABLE public.leaderboards (
  id BIGSERIAL PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT now(),
  game_id TEXT NOT NULL,
  player_name TEXT NOT NULL,
  score INTEGER NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.leaderboards ENABLE ROW LEVEL SECURITY;

-- Allow public read access to leaderboard scores
CREATE POLICY "Public read leaderboards"
  ON public.leaderboards FOR SELECT USING (true);

-- Allow public insert of game scores
CREATE POLICY "Public insert leaderboards"
  ON public.leaderboards FOR INSERT WITH CHECK (true);

-- 2. Create Game Saves Table
CREATE TABLE public.game_saves (
  id BIGSERIAL PRIMARY KEY,
  updated_at TIMESTAMPTZ DEFAULT now(),
  user_id TEXT NOT NULL,
  game_id TEXT NOT NULL,
  save_data JSONB NOT NULL,
  UNIQUE(user_id, game_id)
);

ALTER TABLE public.game_saves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public manage game saves"
  ON public.game_saves FOR ALL USING (true);
```

3. Copy your **Project URL** and **anon public key** from `Settings -> API`.
4. Add them to `js/supabase-client.js`:
   ```javascript
   this.supabaseUrl = 'https://YOUR_PROJECT.supabase.co';
   this.supabaseAnonKey = 'YOUR_ANON_KEY';
   ```
   *(Note: The site works seamlessly even before this step using `localStorage` caching!)*

---

## 🚢 Deploying to Vercel

1. Initialize git and commit:
   ```bash
   git init
   git add .
   git commit -m "Initial commit for games.utility.forum"
   ```
2. Push to your GitHub repository.
3. Import the repository in [Vercel](https://vercel.com/new).
4. In your Vercel Project Settings under **Domains**, add:
   ```
   games.utility.forum
   ```
5. Follow Vercel's instructions to add the CNAME record in your DNS provider for the `games` subdomain pointing to `cname.vercel-dns.com`.

---

## 📝 Session & Development Tracking

All updates and session notes are continuously tracked in [`DEV_NOTES.md`](./DEV_NOTES.md).
