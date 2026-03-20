"""Test si le backend peut s'importer sans MemoryError"""
import os
os.environ["CORS_ALLOW_ORIGIN"] = "http://localhost:5173;http://localhost:8080"
os.environ["WEBUI_NAME"] = "GabomaGPT"
os.environ["CUSTOM_NAME"] = ""
os.environ["WEBUI_AUTH"] = "true"
os.environ["ENABLE_SIGNUP"] = "true"
os.environ["RAG_EMBEDDING_ENGINE"] = "openai"
os.environ["RAG_EMBEDDING_MODEL_AUTO_UPDATE"] = "False"
os.environ["HF_HUB_DISABLE_SYMLINKS_WARNING"] = "1"

try:
    from open_webui.main import app
    print("SUCCESS: Backend imported OK")
except Exception as e:
    print(f"FAIL: {type(e).__name__}: {e}")
