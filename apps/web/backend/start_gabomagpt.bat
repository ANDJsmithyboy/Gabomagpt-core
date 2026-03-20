@echo off
chcp 65001 >nul
:: GabomaGPT v6.0 — Lancement backend Python FastAPI
:: SmartANDJ AI Technologies

SET CORS_ALLOW_ORIGIN=*
SET WEBUI_NAME=GabomaGPT
SET CUSTOM_NAME=
SET WEBUI_AUTH=true
SET ENABLE_SIGNUP=true
SET DEFAULT_USER_ROLE=pending
SET PORT=8080
SET HOST=0.0.0.0
SET RAG_EMBEDDING_ENGINE=openai
SET RAG_EMBEDDING_MODEL_AUTO_UPDATE=False
SET PYTHONIOENCODING=utf-8
SET HF_HUB_DISABLE_SYMLINKS_WARNING=1

echo ==========================================
echo  GabomaGPT Backend - Port %PORT%
echo  SmartANDJ AI Technologies
echo ==========================================

python -m uvicorn open_webui.main:app --host %HOST% --port %PORT%
