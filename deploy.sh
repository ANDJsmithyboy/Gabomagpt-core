#!/bin/bash
# =====================================================
# GabomaGPT v6.0 - Script de deploiement VPS
# SmartANDJ AI Technologies - Constitution Zion Core
# Fondateur : Daniel Jonathan ANDJ
#
# Usage: bash deploy.sh
# Cible : VPS 31.220.80.217
# =====================================================

set -e

# ── Configuration ──
VPS_IP="31.220.80.217"
VPS_USER="root"
REMOTE_DIR="/opt/gabomagpt"
COMPOSE_FILE="docker-compose.coolify.yaml"

echo "═══════════════════════════════════════════"
echo "  GabomaGPT v6.0 — Deploiement VPS"
echo "  SmartANDJ AI Technologies"
echo "═══════════════════════════════════════════"

# ── Etape 1 : Verifier la connexion SSH ──
echo ""
echo "[1/6] Verification connexion SSH vers $VPS_IP..."
ssh -o ConnectTimeout=10 -o BatchMode=yes $VPS_USER@$VPS_IP "echo 'SSH OK'" || {
    echo "ERREUR: Impossible de se connecter a $VPS_IP"
    echo "Verifiez votre cle SSH : ssh-copy-id $VPS_USER@$VPS_IP"
    exit 1
}

# ── Etape 2 : Creer le dossier distant ──
echo "[2/6] Preparation du dossier distant..."
ssh $VPS_USER@$VPS_IP "mkdir -p $REMOTE_DIR"

# ── Etape 3 : Synchroniser le code source ──
echo "[3/6] Synchronisation du code source (rsync)..."
rsync -avz --progress \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='.svelte-kit' \
    --exclude='build' \
    --exclude='__pycache__' \
    --exclude='.env' \
    --exclude='*.jpg' \
    --exclude='*.png' \
    ./ $VPS_USER@$VPS_IP:$REMOTE_DIR/

# ── Etape 4 : Envoyer le fichier .env ──
echo "[4/6] Envoi de la configuration .env..."
scp .env.coolify $VPS_USER@$VPS_IP:$REMOTE_DIR/.env

# ── Etape 5 : Build et demarrage sur le VPS ──
echo "[5/6] Build et demarrage des containers..."
ssh $VPS_USER@$VPS_IP << 'REMOTE_SCRIPT'
cd /opt/gabomagpt

# Installer Docker si absent
if ! command -v docker &> /dev/null; then
    echo "Installation de Docker..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
fi

# Installer docker-compose plugin si absent
if ! docker compose version &> /dev/null; then
    echo "Installation de Docker Compose plugin..."
    apt-get update && apt-get install -y docker-compose-plugin
fi

# Arreter les anciens containers
echo "Arret des anciens containers..."
docker compose -f docker-compose.coolify.yaml down --remove-orphans 2>/dev/null || true

# Build et demarrage
echo "Build depuis le code source (cela peut prendre 5-10 minutes)..."
docker compose -f docker-compose.coolify.yaml build --no-cache
docker compose -f docker-compose.coolify.yaml up -d

# Attendre que le healthcheck passe
echo "Attente du healthcheck (max 120s)..."
for i in $(seq 1 24); do
    if docker compose -f docker-compose.coolify.yaml ps | grep -q "healthy"; then
        echo "GabomaGPT est OPERATIONNEL!"
        break
    fi
    echo "  Attente... ($((i*5))s)"
    sleep 5
done

# Afficher le statut
echo ""
echo "═══ STATUT DES CONTAINERS ═══"
docker compose -f docker-compose.coolify.yaml ps
echo ""
echo "═══ LOGS RECENTS ═══"
docker compose -f docker-compose.coolify.yaml logs --tail=20 gabomagpt
REMOTE_SCRIPT

# ── Etape 6 : Verification finale ──
echo ""
echo "[6/6] Verification finale..."
echo "═══════════════════════════════════════════"
echo "  GabomaGPT deploye avec succes!"
echo ""
echo "  URL: http://$VPS_IP:3000"
echo "  Admin: http://$VPS_IP:3000/admin"
echo ""
echo "  Commandes utiles sur le VPS:"
echo "    ssh $VPS_USER@$VPS_IP"
echo "    cd $REMOTE_DIR"
echo "    docker compose -f $COMPOSE_FILE logs -f gabomagpt"
echo "    docker compose -f $COMPOSE_FILE restart gabomagpt"
echo "═══════════════════════════════════════════"
