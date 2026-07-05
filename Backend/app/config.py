import os
from pathlib import Path
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[1]
load_dotenv(BASE_DIR / ".env")

class Settings:
    # Defaults to a local SQLite file
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./unimind.db")
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.0-flash")
    JWT_SECRET_KEY: str = os.getenv("JWT_SECRET_KEY", "supersecret")
    JWT_ALGORITHM: str = "HS256"
    # Local folder for vector data
    CHROMA_PERSIST_DIR: str = "./chroma_data" 

settings = Settings()