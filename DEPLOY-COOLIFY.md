# GabomaGPT - Guide de Deploiement Coolify

## Le Probleme

Coolify pull l'image officielle `ghcr.io/open-webui/open-webui` au lieu de
builder TON code customise. Resultat: tu perds tout (design Zion Core, splash
"Mbolo !", themes, branding).

## La Solution

Utiliser **Docker Compose** dans Coolify pour builder depuis TON Dockerfile.

---

## Etapes Exactes dans Coolify

### 1. Pusher ton code sur GitHub/GitLab

```bash
cd gabomagpt
git add -A
git commit -m "GabomaGPT v6.0 - JIA 2026"
git push origin main
```

### 2. Dans Coolify : Creer un nouveau service

1. Dashboard Coolify > **+ Add New Resource**
2. Choisir **Docker Compose**
3. Source : **Git Repository**
4. Coller l'URL de ton repo GitHub
5. Branch : `main`
6. **Docker Compose Location** : `docker-compose.coolify.yaml`
   (PAS docker-compose.yaml, celui-la a Ollama/Nginx/etc en plus)

### 3. Variables d'environnement

Dans Coolify > ton service > **Environment Variables**, ajouter :

```
WEBUI_SECRET_KEY=une_cle_random_de_32_caracteres_minimum
POSTGRES_PASSWORD=un_mot_de_passe_fort
GROQ_API_KEY=gsk_ta_vraie_cle
TAVILY_API_KEY=tvly_ta_vraie_cle
```

### 4. Deployer

Cliquer **Deploy**. Coolify va :
- Cloner TON repo
- Builder l'image depuis `apps/web/Dockerfile` (TON code Svelte + Python)
- Lancer PostgreSQL, Redis, ChromaDB
- Lancer GabomaGPT sur le port 3000

### 5. Configurer le domaine

Dans Coolify > ton service > **Domains** :
- Ajouter `gabomagpt.ga` ou ton domaine
- Activer HTTPS (Let's Encrypt automatique)

---

## Verification

Apres deploiement, ouvrir ton domaine. Tu dois voir :
- Splash screen "Mbolo !" avec le logo 5 petales
- Page de login GabomaGPT
- Design Zion Core Obsidian (fond sombre #050810)
- PAS le design blanc/gris d'Open WebUI vanille

## Si ca ne marche pas

1. **Verifier les logs** dans Coolify > ton service > Logs
2. **Le build Svelte prend 2-5 minutes** — sois patient
3. **Si erreur memoire** pendant le build : augmenter la RAM du serveur a 4GB minimum
4. **Si erreur npm** : le Dockerfile utilise `npm ci --force` donc ca devrait passer

---

## Ce qui est deploye

| Service | Image | Source |
|---------|-------|--------|
| GabomaGPT | Built from `apps/web/Dockerfile` | TON code |
| PostgreSQL | `postgres:16-alpine` | Image officielle |
| Redis | `redis:7-alpine` | Image officielle |
| ChromaDB | `chromadb/chroma:latest` | Image officielle |

**ZERO image Open WebUI officielle.** Tout est TON code.
