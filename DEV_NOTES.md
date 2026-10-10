# Development Notes & Session Log

This document tracks all development sessions, architectural decisions, completed work, and future roadmaps for **games.utility.forum**.

---

## 📌 Project Overview
- **Domain / Subdomain:** `games.utility.forum`
- **Purpose:** Fast, lightweight, browser-based indie/retro JavaScript games with music, user save state, and leaderboards.
- **Tech Stack:**
  - **Frontend:** Semantic HTML5, Vanilla Modern CSS (design tokens, glassmorphism, neon arcade theme), Vanilla JavaScript (ES modules).
  - **Audio:** Web Audio API sound synthesis engine (SFX & procedural ambient synth music) + HTML5 Audio support.
  - **Backend / Database:** [Supabase](https://supabase.com) (for user auth, cloud saves, high scores, leaderboards) with graceful offline/local fallback.
  - **Hosting & Deployment:** [Vercel](https://vercel.com) (zero-config static deployment with `vercel.json`).
  - **Version Control:** Git repository.

---

## 📝 Session 1: Initial Setup & Core Pages
**Date:** 2026-10-10  
**Focus:** Project initialization, design system, core portal pages, audio engine, sample game, and deployment configuration.

### Actions Taken:
1. **Created Session Tracking System:**
   - Established `DEV_NOTES.md` to document every session, change, and architectural decision.
2. **Design System & Architecture (`css/style.css`):**
   - Built a sleek, dark-mode cyber/arcade aesthetic using modern CSS variables, glassmorphic card layouts, responsive navigation, and neon glow effects.
   - Clean responsive layout optimized for desktop, tablet, and mobile browsers.
3. **Core Portal Pages Created:**
   - `index.html`: Core homepage with audio controls, CTAs, and layout.
   - `about.html`: Information about `games.utility.forum`, indie game philosophy, open-source tech, roadmap, and contact.
   - `privacy.html`: Comprehensive Privacy Policy tailored for user game saves, Supabase integration, cookies/local storage, and analytics.
   - `terms.html`: Terms of Service covering gameplay, fair use, leaderboards, and user-generated content.
4. **Built-in Synth Audio Engine (`js/audio.js`):**
   - Created a Web Audio API procedural music and sound effects generator.
5. **Supabase Cloud Integration Layer (`js/supabase-client.js`):**
   - Configured modular Supabase client helper with localStorage fallback.
6. **Starter Playable Game (`games/neon-snake/`):**
   - Included canvas game ("Neon Snake 2049") featuring particle effects and synth sound effects.
7. **Deployment & Config (`vercel.json`, `README.md`, `.gitignore`):**
   - Configured `vercel.json` for clean URLs and Git repository initialized.

---

## 📝 Session 2: Day/Night Mode & Simple Hero Homepage Refactor (Current)
**Date:** 2026-10-10  
**Focus:** Implemented Day/Night theme switcher, stripped homepage clutter and marketing claims, built a simple hero homepage.

### Actions Taken:
1. **Day & Night Mode Architecture (`css/style.css`):**
   - **Night Mode (Default):** Retains deep space arcade palette with dark background, subtle grids, and glowing cyan/magenta accents.
   - **Day Mode (`data-theme="light"`):** Clean, crisp white/slate background (`#f8fafc` / `#ffffff`) with high-contrast text (`#0f172a`), refined borders, and tailored vibrant accents.
   - Added smooth CSS color transitions and custom scrollbars for both themes.
2. **Theme Switcher Script (`js/main.js`):**
   - Integrated `#themeToggleBtn` in navigation with persistent state in `localStorage` (`guf_theme`).
   - Dynamic icon and text updates (`☀️ Day` ↔ `🌙 Night`).
   - Added theme switch button across all pages (`index.html`, `about.html`, `privacy.html`, `terms.html`).
3. **Homepage Simplification (`index.html`):**
   - **Removed clutter & claims:** Stripped all buzzword claims (Vercel, Supabase, speed stats, cloud architecture cards) and the games grid catalog from the homepage.
   - **Created Simple Hero:** Clean headline (*Simple Browser Games. Retro Beats. Zero Clutter.*), direct subtitle, primary CTA to play Neon Snake via clean modal overlay, and secondary link to About page.
   - **Clean Highlights:** Replaced cluttered strips with 3 simple, honest feature boxes:
     - 🕹️ Instant Play (Pure browser gameplay without installs)
     - 🎵 Synth Audio (Procedural chiptune engine with mute toggle)
     - 💾 Saved Scores (Automatic run persistence)
   - Streamlined minimal footer across the portal.
4. **Testing & Verification:**
   - Validated layout, Day/Night mode toggling, typography contrast, and game modal functionality in browser.

---

## 🗺️ Next Steps & Roadmap
- [ ] Connect live Supabase project credentials in `js/supabase-client.js` when ready.
- [ ] Add new mini-games (e.g. Neon Breakout, Cyber Pong).
- [ ] Push updates to Git remote and link Vercel domain `games.utility.forum`.

