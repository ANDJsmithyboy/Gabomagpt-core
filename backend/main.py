"""
GabomaGPT — Application Principale · SmartANDJ AI Technologies
FastAPI backend — IA souveraine du Gabon.
Fondateur : Daniel Jonathan ANDJ, CEO, Libreville.
"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from core.config import settings
from db.session import init_db, close_db
from api.auth import router as auth_router
from api.chat import router as chat_router


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Cycle de vie de l'application — init et cleanup."""
    # Démarrage : initialiser la base de données
    await init_db()
    yield
    # Arrêt : fermer les connexions
    await close_db()


# ── Application FastAPI ──────────────────────────────────────
app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    description=(
        "GabomaGPT — L'intelligence artificielle souveraine du Gabon. "
        "Développée par SmartANDJ AI Technologies."
    ),
    lifespan=lifespan,
    docs_url="/docs" if settings.debug else None,
    redoc_url="/redoc" if settings.debug else None,
)

# ── CORS ─────────────────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── Routers ──────────────────────────────────────────────────
app.include_router(auth_router)
app.include_router(chat_router)


# ── Route de santé ───────────────────────────────────────────
@app.get("/", tags=["Santé"])
async def root() -> dict:
    """Route racine — vérification que le serveur tourne."""
    return {
        "name": settings.app_name,
        "version": settings.app_version,
        "company": settings.company_name,
        "founder": settings.founder,
        "status": "operational",
        "message": "Mbolo ! GabomaGPT est opérationnel. 🇬🇦",
    }


@app.get("/health", tags=["Santé"])
async def health() -> dict:
    """Endpoint de santé pour les health checks Docker/Coolify."""
    return {"status": "healthy"}
