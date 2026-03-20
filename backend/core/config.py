"""
GabomaGPT — Configuration · SmartANDJ AI Technologies
Settings Pydantic v2 pour tout le backend.
"""

from pydantic_settings import BaseSettings
from pydantic import Field
from typing import List


class Settings(BaseSettings):
    """Configuration centralisée de GabomaGPT."""

    # ── Application ──────────────────────────────────────────
    app_name: str = "GabomaGPT"
    app_version: str = "1.0.0"
    company_name: str = "SmartANDJ AI Technologies"
    founder: str = "Daniel Jonathan ANDJ"
    environment: str = "development"
    debug: bool = True

    # ── Base de données PostgreSQL ───────────────────────────
    database_url: str = "postgresql+asyncpg://gabomagpt:gabomagpt_secret@localhost:5432/gabomagpt"

    # ── Redis ────────────────────────────────────────────────
    redis_url: str = "redis://localhost:6379"

    # ── ChromaDB ─────────────────────────────────────────────
    chroma_host: str = "localhost"
    chroma_port: int = 8001

    # ── Groq (Flash + Pro) ───────────────────────────────────
    groq_api_key: str = ""

    # Modèles Groq
    flash_model: str = "llama-3.3-8b-versatile"
    pro_model: str = "llama-3.3-70b-versatile"

    # ── Kimi K2 (Black Panther) ──────────────────────────────
    kimi_api_key: str = ""
    kimi_base_url: str = "https://api.moonshot.cn/v1"
    kimi_model: str = "kimi-k2"

    # ── Tavily (Web Search) ──────────────────────────────────
    tavily_api_key: str = ""

    # ── JWT Authentification ─────────────────────────────────
    jwt_secret: str = "changez_cette_valeur_en_production_gabomagpt_2026"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 10080  # 7 jours

    # ── Airtel Money ─────────────────────────────────────────
    airtel_money_api_key: str = ""
    airtel_money_client_id: str = ""
    airtel_money_secret: str = ""

    # ── CORS ─────────────────────────────────────────────────
    cors_origins: str = "http://localhost:3000,http://localhost:8081"

    @property
    def cors_origins_list(self) -> List[str]:
        """Retourne les origines CORS sous forme de liste."""
        return [origin.strip() for origin in self.cors_origins.split(",")]

    @property
    def is_production(self) -> bool:
        """Vérifie si on est en production."""
        return self.environment == "production"

    model_config = {
        "env_file": ".env",
        "env_file_encoding": "utf-8",
        "case_sensitive": False,
    }


# Instance globale des settings
settings = Settings()
