# GabomaGPT — VPS Deployment Guide
## SmartANDJ AI Technologies · Fondateur: Daniel Jonathan ANDJ

**Domain:** `https://gabomagpt.andjanalytics.com`
**VPS IP:** `31.220.80.217`
**GitHub:** `https://github.com/ANDJsmithyboy/Gabomagpt-core.git`

---

## 1. DNS Setup (do this FIRST)

In your domain registrar (Namecheap, Cloudflare, etc.), create an **A record**:

```
Type: A
Host: gabomagpt
Value: 31.220.80.217
TTL: 300
```

Wait for DNS propagation (5-30 min). Verify: `ping gabomagpt.andjanalytics.com`

---

## 2. SSH into VPS

```bash
ssh root@31.220.80.217
```

---

## 3. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo systemctl enable docker && sudo systemctl start docker

# Install Docker Compose (v2)
sudo apt install -y docker-compose-plugin

# Install Nginx + Certbot
sudo apt install -y nginx certbot python3-certbot-nginx

# Install Git
sudo apt install -y git
```

---

## 4. Clone Repository

```bash
cd /opt
git clone https://github.com/ANDJsmithyboy/Gabomagpt-core.git gabomagpt
cd /opt/gabomagpt
```

---

## 5. Configure Environment

```bash
cp .env.example .env
nano .env
```

**Fill in these critical values:**
```
GROQ_API_KEY=gsk_your_real_key
ANTHROPIC_API_KEY=sk-ant-your_real_key
TAVILY_API_KEY=tvly_your_real_key
WEBUI_SECRET_KEY=generate_a_strong_random_string
GOOGLE_OAUTH_CLIENT_ID=your_google_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_google_secret
OPENAI_TTS_API_KEY=sk-your_openai_key
```

**Generate a strong secret:**
```bash
openssl rand -hex 32
```

---

## 6. Setup Nginx + SSL

```bash
# Copy config
sudo cp nginx.conf /etc/nginx/sites-available/gabomagpt
sudo ln -sf /etc/nginx/sites-available/gabomagpt /etc/nginx/sites-enabled/gabomagpt
sudo rm -f /etc/nginx/sites-enabled/default

# Test config (will warn about SSL certs — that's OK for now)
sudo nginx -t

# Start Nginx (HTTP only first for Certbot)
# Temporarily comment out the HTTPS server block in /etc/nginx/sites-available/gabomagpt
# Or just start and let Certbot handle it:
sudo systemctl start nginx

# Get SSL certificate
sudo certbot --nginx -d gabomagpt.andjanalytics.com \
  --non-interactive --agree-tos \
  -m daniel@andjanalytics.com

# Verify SSL auto-renewal
sudo certbot renew --dry-run

# Enable Nginx on boot
sudo systemctl enable nginx
```

---

## 7. Build & Start GabomaGPT

```bash
cd /opt/gabomagpt

# Build and start (first time takes 5-10 min)
docker compose -f docker-compose.prod.yml up -d --build

# Watch logs
docker compose -f docker-compose.prod.yml logs -f gabomagpt

# Wait for healthcheck to pass
docker ps
```

---

## 8. Verify Deployment

```bash
# Check container is running
docker ps | grep gabomagpt

# Check health
curl -s http://localhost:3000/health

# Check Nginx
curl -s http://localhost/nginx-health

# Check HTTPS (from any machine)
curl -s https://gabomagpt.andjanalytics.com/health
```

Visit: **https://gabomagpt.andjanalytics.com**

---

## 9. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create OAuth 2.0 Client ID (Web application)
3. **Authorized redirect URIs:**
   ```
   https://gabomagpt.andjanalytics.com/oauth/google/callback
   ```
4. Copy Client ID + Secret to `.env`
5. Restart: `docker compose -f docker-compose.prod.yml up -d`

---

## Common Commands

```bash
# Update code + rebuild
cd /opt/gabomagpt
git pull origin main
docker compose -f docker-compose.prod.yml up -d --build

# Restart without rebuild
docker compose -f docker-compose.prod.yml restart

# View logs
docker compose -f docker-compose.prod.yml logs -f --tail=100

# Stop
docker compose -f docker-compose.prod.yml down

# Full reset (keeps data volume)
docker compose -f docker-compose.prod.yml down
docker compose -f docker-compose.prod.yml up -d --build --force-recreate

# Backup data
docker cp gabomagpt-web:/app/backend/data ./backup-$(date +%Y%m%d)

# Renew SSL manually
sudo certbot renew
sudo systemctl reload nginx
```

---

## Firewall

```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP (redirect)
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

---

## Monitoring

```bash
# Memory usage
docker stats gabomagpt-web

# Disk usage
df -h
docker system df

# Nginx access logs
sudo tail -f /var/log/nginx/access.log
```

---

**GabomaGPT v1.0 — SmartANDJ AI Technologies**
*IA Souveraine du Gabon · Libreville · 2026*
