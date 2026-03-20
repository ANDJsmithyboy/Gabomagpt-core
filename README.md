# GabomaGPT v6.0 — IA Souveraine du Gabon

**SmartANDJ AI Technologies · Constitution Zion Core**  
Fondateur : Daniel Jonathan ANDJ, CEO, Libreville, Gabon  
Deadline : 8 avril 2026 — JIA 2026, pitch 1.2M USD

---

## 🚀 Démarrage rapide

### Option 1 : Dev local (Frontend uniquement)

```bash
cd apps/web
cmd /c "npm install"
cmd /c "npm run dev"
```

Frontend accessible sur **http://localhost:5173**

### Option 2 : Full Stack avec Docker

```bash
# 1. Copier et configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos API keys

# 2. Lancer tous les services
docker compose up --build

# 3. Accéder à l'application
# Frontend : http://localhost:3000
# Go Auth+Pay : http://localhost:8001
# Rust RAG : http://localhost:8002
# ChromaDB : http://localhost:8003
```

---

## 📦 Architecture

```
gabomagpt/
├── apps/web/              ← Frontend SvelteKit (Open WebUI fork)
│   ├── src/
│   │   ├── app.css        ← Zion Core Obsidian design system
│   │   ├── lib/
│   │   │   ├── animations/   ← GSAP spring physics
│   │   │   ├── actions/      ← Svelte actions (magnetic, ambientLight)
│   │   │   ├── stores/mode.ts ← Flash/Pro/BP modes
│   │   │   └── components/
│   │   │       ├── chat/ReflectionAura.svelte  ← GSAP 5-arc breathing
│   │   │       ├── chat/ModeSwitch.svelte      ← 3 pilules mode
│   │   │       └── sidebar/IbogaToggle.svelte  ← Iboga AI toggle
│   │   └── static/
│   │       ├── gabomagpt-logo.jpeg  ← Logo 5 pétales
│   │       └── iboga-ai.jpeg        ← Arbre neural Iboga
│   └── backend/open_webui/  ← Backend Python FastAPI intégré
├── backend/
│   ├── go/                ← Auth OTP + Payments (Fiber, port 8001)
│   └── rust/              ← RAG Engine + Parser 9 langues (Actix-web, port 8002)
├── fine_tuning/
│   └── zion_core_constitution.md  ← Constitution IA complète
├── docker-compose.yml     ← Orchestration 7 services
└── .env                   ← Variables d'environnement
```

---

## 🎨 Design System — Zion Core Obsidian

### Couleurs
- **Fond** : `#080B12` (bg-deep)
- **Vert émeraude** : `#2ECC8A` (green-emerald)
- **Or gabonais** : `#C9A84C` (gold-gabon)
- **Iboga fire** : `#FF2244` (iboga-fire)

### Polices
- **Display** : Outfit (headings)
- **Body** : Sora (paragraphes)
- **Code** : JetBrains Mono (code + BP mode)

### Apple Premium UX (Section 4C)
- **GSAP** : Spring physics, stagger reveal, 5-arc breathing
- **Svelte actions** : `use:magnetic`, `use:ambientLight`
- **CSS** : `.glass`, `.skeleton`, `.scroll-fade`, `.text-gradient-gabon`

---

## 🤖 3 Modes IA

| Mode | Emoji | Modèle | Provider | Couleur | Usage |
|------|-------|--------|----------|---------|-------|
| **Flash** | ⚡ | llama-3.3-8b-instant | Groq | #FFD54F | Rapide et léger |
| **Pro** | 🐬 | llama-3.3-70b-versatile | Groq | #29B6F6 | Puissant et polyvalent |
| **Black Panther** | 🐆 | claude-sonnet-4-20250514 | Anthropic | #FF2244 | Agent autonome + Airtel Money |

---

## 🔐 Authentification (Go)

1. **Phone OTP** (Africa's Talking) — priorité Gabon
2. **Email + Password**
3. **Google OAuth**

---

## 💳 Paiements (Go)

### Plans
- **Free** : 0 XAF — 10 messages/jour
- **Pro** : 2500 XAF/mois — illimité Flash + Pro
- **Black Panther** : 7500 XAF/mois — illimité + agent autonome

### Providers
- **Airtel Money** (API directe)
- **Moov Money** (via SUMB)

---

## 🌍 Langues supportées (Rust Parser)

1. Fang
2. Myènè
3. Nzebi
4. Punu
5. Teke
6. Kota
7. Obamba
8. Tsogo
9. Français

---

## 📚 Stack Technique

| Composant | Technologie | Port |
|-----------|-------------|------|
| Frontend | SvelteKit 2 + TypeScript + Tailwind | 5173 (dev), 3000 (prod) |
| Backend Python | FastAPI (Open WebUI intégré) | 8080 (interne) |
| Backend Go | Fiber (Auth + Payments) | 8001 |
| Backend Rust | Actix-web + gRPC (RAG + Parser) | 8002 |
| Database | PostgreSQL 16 | 5432 |
| Cache | Redis 7 | 6379 |
| Vector DB | ChromaDB | 8003 |
| LLM Local | Ollama | 11434 |

---

## 🛠️ Commandes utiles

### Dev local
```bash
# Frontend
cd apps/web
cmd /c "npm run dev"

# Backend Go (si Go installé)
cd backend/go
go run ./cmd/server

# Backend Rust (si Rust installé)
cd backend/rust
cargo run
```

### Docker
```bash
# Tout lancer
docker compose up --build

# Logs d'un service
docker compose logs -f web
docker compose logs -f auth-pay
docker compose logs -f rag-engine

# Arrêter tout
docker compose down

# Supprimer volumes (reset DB)
docker compose down -v
```

### Build production
```bash
# Frontend
cd apps/web
cmd /c "npm run build"

# Go
cd backend/go
go build -o bin/server ./cmd/server

# Rust
cd backend/rust
cargo build --release
```

---

## 🔑 Variables d'environnement requises

Copier `.env.example` → `.env` et remplir :

### Critiques
- `WEBUI_SECRET_KEY` — min 32 caractères
- `JWT_SECRET` — min 32 caractères
- `POSTGRES_PASSWORD`

### API Keys
- `GROQ_API_KEY` — Flash + Pro modes
- `ANTHROPIC_API_KEY` — Black Panther mode
- `AFRICAS_TALKING_API_KEY` + `AFRICAS_TALKING_USERNAME` — OTP SMS
- `AIRTEL_MONEY_CLIENT_ID` + `AIRTEL_MONEY_CLIENT_SECRET` — Paiements
- `GOOGLE_CLIENT_ID` + `GOOGLE_CLIENT_SECRET` — OAuth

### Optionnelles
- `TAVILY_API_KEY` — Web search
- `MOOV_SUMB_API_KEY` — Moov Money

---

## 📝 Règles de code

- **TypeScript strict** — pas de `any`
- **Commentaires en français**, variables en anglais camelCase
- **Header fichier** : `/* GabomaGPT · [FileName] SmartANDJ AI Technologies · Constitution Zion Core */`
- **Zéro trace d'Open WebUI** dans le produit final
- **PowerShell** : toutes les commandes npm via `cmd /c "npm ..."`

---

## 🐳 Services Docker

| Service | Image | Description |
|---------|-------|-------------|
| `web` | gabomagpt-web | Frontend SvelteKit + Backend Python FastAPI |
| `ollama` | ollama/ollama | Modèles LLM locaux (optionnel) |
| `auth-pay` | gabomagpt-auth-pay | Microservice Go (Auth + Payments) |
| `rag-engine` | gabomagpt-rag | Microservice Rust (RAG + Parser) |
| `postgres` | postgres:16-alpine | Base de données principale |
| `redis` | redis:7-alpine | Cache + sessions + OTP + rate limiting |
| `chromadb` | chromadb/chroma | Vector store pour RAG |

---

## 🎯 Prochaines étapes

1. ✅ Frontend SvelteKit avec Apple Premium UX
2. ✅ Backend Go (Auth OTP + Airtel Money)
3. ✅ Backend Rust (RAG Engine + Parser 9 langues)
4. ⏳ Intégration complète des 3 backends
5. ⏳ Tests E2E
6. ⏳ Déploiement Hetzner + Coolify
7. ⏳ JIA 2026 pitch deck

---

## 📄 Licence

Propriétaire — SmartANDJ AI Technologies  
© 2026 Daniel Jonathan ANDJ

---

## 🤝 Contact

**Fondateur** : Daniel Jonathan ANDJ  
**Email** : contact@smartandj.com  
**Localisation** : Libreville, Gabon  
**Pitch** : JIA 2026 — 8 avril 2026
