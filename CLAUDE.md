# GabomaGPT v6.0 FINAL — Contexte Windsurf Cascade

## Qui je suis
GabomaGPT est l'IA souveraine du Gabon, fork complet d'Open WebUI (SvelteKit).
Fondateur : Daniel Jonathan ANDJ, CEO SmartANDJ AI Technologies, Libreville.
Deadline : 8 avril 2026 — JIA 2026, pitch 1.2M USD.

## Architecture v6.0
```
gabomagpt/
├── apps/web/               ← Open WebUI fork (SvelteKit 2 + TypeScript + Tailwind)
│   ├── src/
│   │   ├── app.css         ← Design System Zion Core Obsidian
│   │   ├── app.html        ← Titre GabomaGPT, favicon 5 pétales
│   │   ├── lib/
│   │   │   ├── constants.ts      ← APP_NAME = 'GabomaGPT'
│   │   │   ├── stores/mode.ts    ← Store Flash/Pro/BP
│   │   │   └── components/
│   │   │       ├── chat/ReflectionAura.svelte   ← Aura 5 couleurs
│   │   │       ├── chat/ModeSwitch.svelte       ← 3 pilules
│   │   │       └── sidebar/IbogaToggle.svelte   ← Arbre neural
│   │   └── routes/
│   ├── static/favicon.svg         ← Logo 5 pétales SVG
│   ├── docker-compose.yaml        ← Services GabomaGPT + Ollama
│   └── backend/open_webui/        ← Backend Python (FastAPI intégré)
├── backend/
│   ├── go/                 ← Microservice Auth + Payments (Fiber)
│   │   ├── internal/auth/  ← JWT + OTP Africa's Talking
│   │   └── internal/payment/ ← Airtel Money + Moov
│   ├── rust/               ← RAG Engine + Parser linguistique (Actix-web)
│   │   └── src/parser.rs   ← 9 langues gabonaises (Fang, Myènè, Nzebi...)
│   └── (legacy Python)     ← Ancien backend Next.js (à supprimer)
├── fine_tuning/
│   └── zion_core_constitution.md  ← Constitution IA complète
└── CLAUDE.md               ← Ce fichier
```

## Stack Technique
- **Web** : SvelteKit 2 (Open WebUI fork) + TypeScript strict + Tailwind
- **Mobile** : Capacitor (même build SvelteKit → Android + iOS)
- **Python** : FastAPI (AI + RAG + LLM intégré Open WebUI)
- **Go** : Fiber (Auth OTP + Payments Airtel/Moov — port 8001)
- **Rust** : Actix-web + gRPC (RAG Engine + Parser 9 langues — port 8002)
- **Infra** : Hetzner + Coolify + Docker + GitHub Actions

## Design System — Zion Core Obsidian
- Fond : `--bg-deep: #080B12`
- Vert émeraude : `--green-emerald: #2ECC8A`
- Or gabonais : `--gold-gabon: #C9A84C`
- Iboga fire : `--iboga-fire: #FF2244`
- Polices : Outfit (display), Sora (body), JetBrains Mono (code)

## 3 Modes IA
- **Flash ⚡** : `llama-3.3-8b-instant` Groq — jaune #FFD54F
- **Pro 🐬** : `llama-3.3-70b-versatile` Groq — bleu #29B6F6
- **Black Panther 🐆** : `claude-sonnet-4-20250514` Anthropic — rouge #FF2244

## Auth (Go)
1. Phone OTP (Africa's Talking) — priorité Gabon
2. Email + Password
3. Google OAuth

## Paiements (Go)
- Airtel Money API (XAF) — plans: Free/Pro 2500 XAF/BP 7500 XAF
- Moov via SUMB

## ENV Coolify (critique)
```env
WEBUI_NAME=GabomaGPT
CUSTOM_NAME=GabomaGPT
WEBUI_AUTH=true
ENABLE_SIGNUP=true
DEFAULT_USER_ROLE=pending
```

## Commandes utiles
- dev frontend : `cd apps/web && npm run dev`
- dev Go : `cd backend/go && go run ./cmd/server`
- dev Rust : `cd backend/rust && cargo run`
- build docker : `docker compose up --build`

## Section 4C — Apple-Level Premium UX
Dépendance unique ajoutée : `gsap ^3.12.5`

### Fichiers créés
- `src/lib/animations/spring.ts` — springIn, springOut, springButton, springScale
- `src/lib/animations/stagger.ts` — staggerReveal, staggerFade
- `src/lib/actions/magnetic.ts` — Svelte action curseur magnétique (`use:magnetic`)
- `src/lib/actions/ambientLight.ts` — Svelte action lumière 3D (`use:ambientLight`)

### 11 Principes implémentés
1. **Spring Physics** — élastique, jamais linear/ease-in-out
2. **Depth Blur** — `.glass`, `.glass-gold`, `.glass-bp` (backdrop-filter)
3. **Reflection Aura GSAP** — 5 arcs SVG qui respirent (ReflectionAura.svelte)
4. **Stagger Reveal** — enfants en cascade 45ms
5. **Magnetic Cursor** — boutons attirent le pointeur
6. **Shimmer Skeleton** — `.skeleton` (pas de spinners)
7. **Ambient Light** — cartes tilt 3D + gradient souris
8. **Typography Apple** — letter-spacing tight, line-height serré
9. **Scroll Fade** — `.scroll-fade` (mask-image bords fondus)
10. **Mode Transition** — morphing couleur 400ms sur tout l'UI
11. **Splash Cinématique** — logo + "Mbolo !" + subtitle sur fond #080B12

### Logos réels
- `static/gabomagpt-logo.jpeg` — logo 5 pétales (Sidebar header + ChatPlaceholder + Splash)
- `static/iboga-ai.jpeg` — arbre neural Iboga AI (IbogaToggle sidebar)

### Classes CSS (app.css)
- `.glass` `.glass-gold` `.glass-bp` — frosted glass Apple
- `.skeleton` — shimmer loading
- `.scroll-fade` — bords fondus
- `.text-gradient-gabon` `.text-gradient-bp` — texte dégradé
- `.splash-logo` `.splash-title` `.splash-subtitle` — splash cinématique

## Règles de code
- TypeScript strict — pas de `any`
- Commentaires en français, variables en anglais camelCase
- Header fichier : `/* GabomaGPT · [FileName] SmartANDJ AI Technologies · Constitution Zion Core */`
- Zéro trace d'Open WebUI dans le produit final
- Toute commande npm via `cmd /c "npm ..."` (PowerShell bloque les scripts)
