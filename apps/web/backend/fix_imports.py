"""
GabomaGPT — Fix Python imports
Le rebranding a renommé 'open_webui' en 'gabomagpt' dans les imports Python,
mais le package reste open_webui/. Ce script revert les imports.
"""
import os
import re

BACKEND_DIR = os.path.dirname(os.path.abspath(__file__))
OPEN_WEBUI_DIR = os.path.join(BACKEND_DIR, "open_webui")

count = 0
files_changed = 0

for root, dirs, files in os.walk(OPEN_WEBUI_DIR):
    for fname in files:
        if not fname.endswith(".py"):
            continue
        fpath = os.path.join(root, fname)
        with open(fpath, "r", encoding="utf-8", errors="ignore") as f:
            content = f.read()

        # Replace 'from gabomagpt.' with 'from open_webui.'
        # Replace 'import gabomagpt.' with 'import open_webui.'
        # Replace 'gabomagpt.' references in strings carefully
        new_content = content.replace("from gabomagpt.", "from open_webui.")
        new_content = new_content.replace("from gabomagpt ", "from open_webui ")
        new_content = new_content.replace("import gabomagpt.", "import open_webui.")
        new_content = new_content.replace("import gabomagpt", "import open_webui")
        new_content = new_content.replace('"gabomagpt.', '"open_webui.')
        new_content = new_content.replace("'gabomagpt.", "'open_webui.")

        if new_content != content:
            replacements = content.count("gabomagpt") - new_content.count("gabomagpt")
            count += replacements
            files_changed += 1
            with open(fpath, "w", encoding="utf-8", newline="\n") as f:
                f.write(new_content)

print(f"Fixed {count} references in {files_changed} files")
