"""
GabomaGPT · rebrand.py · SmartANDJ AI Technologies
Script de rebranding — supprime toutes traces de Open WebUI
Usage: python scripts/rebrand.py
"""

import os
import re
import sys
from pathlib import Path

# Répertoire racine du projet
ROOT = Path(__file__).resolve().parent.parent

# Extensions à scanner
EXTENSIONS = {".svelte", ".ts", ".js", ".py", ".yaml", ".yml", ".json", ".html", ".md", ".css", ".env", ".toml", ".cfg"}

# Dossiers à ignorer
SKIP_DIRS = {"node_modules", ".git", "__pycache__", ".svelte-kit", "build", "dist", ".next", "venv", ".venv"}

# Remplacements textuels (ordre important — plus spécifique d'abord)
REPLACEMENTS = [
    # URLs GitHub
    ("https://github.com/open-webui/open-webui", "https://github.com/smartandj/gabomagpt"),
    ("https://github.com/open-webui", "https://github.com/smartandj"),
    ("github.com/open-webui/open-webui", "github.com/smartandj/gabomagpt"),
    ("github.com/open-webui", "github.com/smartandj"),

    # URLs documentation
    ("https://docs.openwebui.com", "https://docs.gabomagpt.ga"),
    ("https://openwebui.com", "https://gabomagpt.ga"),
    ("docs.openwebui.com", "docs.gabomagpt.ga"),
    ("openwebui.com", "gabomagpt.ga"),

    # Discord / community
    ("https://discord.gg/open-webui", "https://wa.me/24107000000"),
    ("discord.gg/open-webui", "wa.me/24107000000"),

    # Noms de marque — PascalCase, camelCase, etc.
    ("Open WebUI Community", "Communauté GabomaGPT"),
    ("Open WebUI", "GabomaGPT"),
    ("open-webui", "gabomagpt"),
    ("open_webui", "gabomagpt"),
    ("OpenWebUI", "GabomaGPT"),
    ("openwebui", "gabomagpt"),
    ("OPEN_WEBUI", "GABOMAGPT"),

    # Descriptions
    ("User-friendly AI Interface", "IA Souveraine du Gabon"),
    ("Extensible, feature-rich, and user-friendly self-hosted AI platform", "GabomaGPT — IA Souveraine du Gabon par SmartANDJ AI Technologies"),

    # Copyright
    ("Copyright (c) 2023-2025 Open WebUI", "Copyright (c) 2025-2026 SmartANDJ AI Technologies"),
    ("Copyright 2023-2025 Open WebUI", "Copyright 2025-2026 SmartANDJ AI Technologies"),

    # Docker image
    ("ghcr.io/open-webui/open-webui", "ghcr.io/smartandj/gabomagpt"),
]

# Fichiers spéciaux à mettre à jour
SPECIAL_FILES = {
    "LICENSE": "MIT License\n\nCopyright (c) 2025-2026 SmartANDJ AI Technologies\n\nPermission is hereby granted, free of charge, to any person obtaining a copy\nof this software and associated documentation files (the \"Software\"), to deal\nin the Software without restriction, including without limitation the rights\nto use, copy, modify, merge, publish, distribute, sublicense, and/or sell\ncopies of the Software, and to permit persons to whom the Software is\nfurnished to do so, subject to the following conditions:\n\nThe above copyright notice and this permission notice shall be included in all\ncopies or substantial portions of the Software.\n\nTHE SOFTWARE IS PROVIDED \"AS IS\", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR\nIMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,\nFITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE\nAUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER\nLIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,\nOUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE\nSOFTWARE.\n",
}

# Compteurs
stats = {"files_scanned": 0, "files_modified": 0, "replacements": 0}


def should_process(path: Path) -> bool:
    """Vérifie si un fichier doit être traité"""
    if any(skip in path.parts for skip in SKIP_DIRS):
        return False
    if path.suffix not in EXTENSIONS:
        return False
    if path.name in (".gitignore", ".npmrc"):
        return False
    return True


def process_file(filepath: Path) -> None:
    """Applique les remplacements sur un fichier"""
    stats["files_scanned"] += 1

    try:
        content = filepath.read_text(encoding="utf-8", errors="ignore")
    except Exception as e:
        print(f"  ⚠️  Impossible de lire {filepath}: {e}")
        return

    original = content
    file_replacements = 0

    for old, new in REPLACEMENTS:
        if old in content:
            count = content.count(old)
            content = content.replace(old, new)
            file_replacements += count

    if file_replacements > 0:
        try:
            filepath.write_text(content, encoding="utf-8")
            stats["files_modified"] += 1
            stats["replacements"] += file_replacements
            print(f"  ✅ {filepath.relative_to(ROOT)} ({file_replacements} remplacements)")
        except Exception as e:
            print(f"  ❌ Erreur écriture {filepath}: {e}")


def write_special_files() -> None:
    """Écriture des fichiers spéciaux (LICENSE, etc.)"""
    for filename, content in SPECIAL_FILES.items():
        filepath = ROOT / filename
        try:
            filepath.write_text(content, encoding="utf-8")
            print(f"  📄 {filename} → réécrit")
        except Exception as e:
            print(f"  ❌ Erreur écriture {filename}: {e}")


def update_env_file() -> None:
    """Met à jour le .env avec les variables GabomaGPT"""
    env_path = ROOT / ".env"
    if not env_path.exists():
        return

    content = env_path.read_text(encoding="utf-8", errors="ignore")

    # Ajouter/mettre à jour les variables GabomaGPT
    env_vars = {
        "WEBUI_NAME": "GabomaGPT",
        "CUSTOM_NAME": "GabomaGPT",
        "WEBUI_AUTH": "true",
    }

    for key, value in env_vars.items():
        pattern = rf"^{key}=.*$"
        replacement = f"{key}={value}"
        if re.search(pattern, content, re.MULTILINE):
            content = re.sub(pattern, replacement, content, flags=re.MULTILINE)
        else:
            content += f"\n{key}={value}"

    env_path.write_text(content, encoding="utf-8")
    print(f"  🔧 .env → variables GabomaGPT mises à jour")


def main():
    print("=" * 60)
    print("  GabomaGPT Rebrand Script")
    print("  SmartANDJ AI Technologies")
    print("=" * 60)
    print(f"\n📁 Racine: {ROOT}\n")

    # Phase 1 : Remplacements textuels
    print("── Phase 1 : Remplacements textuels ──")
    for filepath in sorted(ROOT.rglob("*")):
        if filepath.is_file() and should_process(filepath):
            process_file(filepath)

    # Phase 2 : Fichiers spéciaux
    print("\n── Phase 2 : Fichiers spéciaux ──")
    write_special_files()

    # Phase 3 : Variables d'environnement
    print("\n── Phase 3 : Variables d'environnement ──")
    update_env_file()

    # Résumé
    print("\n" + "=" * 60)
    print(f"  📊 Fichiers scannés : {stats['files_scanned']}")
    print(f"  ✅ Fichiers modifiés : {stats['files_modified']}")
    print(f"  🔄 Remplacements : {stats['replacements']}")
    print("=" * 60)
    print("\n🇬🇦 Rebrand GabomaGPT terminé ! Le Gabon est fier.")


if __name__ == "__main__":
    main()
