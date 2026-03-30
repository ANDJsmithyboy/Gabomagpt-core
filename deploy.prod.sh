#!/bin/bash
# GabomaGPT · deploy.prod.sh · SmartANDJ AI Technologies
# Script de déploiement production sur VPS
# Usage: chmod +x deploy.prod.sh && ./deploy.prod.sh

set -e

echo "🇬🇦 ═══════════════════════════════════════════════"
echo "   GabomaGPT — Déploiement Production"
echo "   SmartANDJ AI Technologies · Libreville, Gabon"
echo "═══════════════════════════════════════════════════"
echo ""

# ── 1. Vérification Docker ──────────────────────────────
if ! command -v docker &> /dev/null; then
    echo "📦 Installation de Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    echo "✅ Docker installé"
fi

if ! command -v docker compose &> /dev/null; then
    echo "❌ docker compose non trouvé. Installez Docker Compose V2."
    exit 1
fi

echo "✅ Docker $(docker --version | cut -d' ' -f3) détecté"

# ── 2. Vérification du fichier .env ─────────────────────
if [ ! -f .env ]; then
    echo "⚠️  Fichier .env manquant !"
    echo "   Copie le template : cp .env.example .env"
    echo "   Puis remplis les clés API (GROQ_API_KEY, TAVILY_API_KEY, etc.)"
    exit 1
fi

echo "✅ Fichier .env trouvé"

# ── 3. Pull dernière version ────────────────────────────
echo ""
echo "📥 Mise à jour du code depuis GitHub..."
git pull origin main --ff-only || git pull origin master --ff-only
echo "✅ Code à jour"

# ── 4. Build et lancement ──────────────────────────────
echo ""
echo "🔨 Construction des images Docker..."
docker compose -f docker-compose.prod.yml build --no-cache

echo ""
echo "🚀 Lancement des conteneurs..."
docker compose -f docker-compose.prod.yml up -d

# ── 5. Vérification santé ──────────────────────────────
echo ""
echo "⏳ Attente du démarrage (30s)..."
sleep 30

if docker compose -f docker-compose.prod.yml ps | grep -q "healthy\|running"; then
    echo ""
    echo "🇬🇦 ═══════════════════════════════════════════════"
    echo "   ✅ GabomaGPT est EN LIGNE !"
    echo ""
    echo "   🌐 Interface : https://$(grep DOMAIN .env 2>/dev/null | cut -d= -f2 || echo 'votre-domaine.com')"
    echo "   📱 Mobile    : Même URL (responsive)"
    echo ""
    echo "   Commandes utiles :"
    echo "   • Logs     : docker compose -f docker-compose.prod.yml logs -f"
    echo "   • Restart  : docker compose -f docker-compose.prod.yml restart"
    echo "   • Stop     : docker compose -f docker-compose.prod.yml down"
    echo "   • Update   : git pull && ./deploy.prod.sh"
    echo "═══════════════════════════════════════════════════"
else
    echo "❌ Problème au démarrage. Vérifie les logs :"
    echo "   docker compose -f docker-compose.prod.yml logs"
fi
