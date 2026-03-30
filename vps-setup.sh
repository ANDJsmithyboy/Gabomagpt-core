#!/bin/bash
# GabomaGPT · vps-setup.sh · Déploiement complet en une commande
# Coller ce script entier dans le terminal SSH du VPS
set -e

echo "🇬🇦 Installation GabomaGPT sur VPS..."

# 1. Docker
if ! command -v docker &> /dev/null; then
  echo "📦 Installation Docker..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable docker && systemctl start docker
fi
echo "✅ Docker OK"

# 2. Clone
if [ ! -d "/root/Gabomagpt-core" ]; then
  cd /root
  git clone https://github.com/ANDJsmithyboy/Gabomagpt-core.git
fi
cd /root/Gabomagpt-core
git pull origin main

# 3. .env
cat > .env << 'ENVEOF'
GROQ_API_KEY=YOUR_GROQ_API_KEY_HERE
TAVILY_API_KEY=YOUR_TAVILY_API_KEY_HERE
WEBUI_SECRET_KEY=YOUR_SECRET_KEY_HERE
DOMAIN=YOUR_VPS_IP_HERE
ENVEOF
echo "⚠️  Édite .env avec tes vraies clés : nano .env"

# 4. Build + Launch
echo "🔨 Build Docker (patience ~5min)..."
docker compose -f docker-compose.prod.yml up -d --build

echo ""
echo "🇬🇦 ════════════════════════════════════════"
echo "   GabomaGPT est EN LIGNE !"
echo "   → http://31.220.80.217"
echo "════════════════════════════════════════════"
